import status from "http-status";
import AppError from "../../errorHelpers/appError";
import { tokenHelpers } from "../../utils/token";
import bcrypt from "bcryptjs";
import { userSafeSelect } from "../user/user.constants";
import {
  ILoginUserPayload,
  IRegisterUserPayload,
  IChangePasswordPayload,
  IRefreshTokenPayload,
} from "./auth.interface";
import { prisma } from "../../lib/prisma";
import { jwtHelpers } from "../../utils/jwt";
import { envVars } from "../../../config/env";

const registerUser = async (payload: IRegisterUserPayload) => {
  const { name, email, password, phone } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "User already exists with this email",
    );
  }

  const isPhoneExist = await prisma.user.findUnique({
    where: { phone },
  });

  if (isPhoneExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "User already exists with this phone",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      email,
      password: hashedPassword,
    },
    select: userSafeSelect,
  });

  const accessToken = tokenHelpers.getAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const refreshToken = tokenHelpers.getRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return {
    user: user,
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(status.UNAUTHORIZED, "Invalid password");
  }

  const accessToken = tokenHelpers.getAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const refreshToken = tokenHelpers.getRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (payload: IRefreshTokenPayload) => {
  const { refreshToken } = payload;

  const verifiedToken = jwtHelpers.verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_TOKEN_SECRET,
  );

  if (!verifiedToken.success || !verifiedToken.data) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const user = verifiedToken.data;

  const newAccessToken = tokenHelpers.getAccessToken({
    userId: user.userId,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (userId: string, payload: IChangePasswordPayload) => {
  const { currentPassword, newPassword } = payload;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordMatch) {
    throw new AppError(status.UNAUTHORIZED, "Current password is incorrect");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedNewPassword,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

export const authService = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
};

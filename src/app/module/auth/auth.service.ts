import status from "http-status";
import AppError from "../../errorHelpers/appError";
import { tokenHelpers } from "../../utils/token";
import bcrypt from "bcryptjs";
import { userSafeSelect } from "../user/user.constants";
import {
  ILoginUserPayload,
  IRegisterUserPayload,
} from "./auth.interface";
import { prisma } from "../../lib/prisma";

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

const getMe = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
// exept password from user
  return {
    id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export const authService = {
  registerUser,
  loginUser,
  getMe,
};

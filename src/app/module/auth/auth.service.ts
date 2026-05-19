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
  const { name, email, password, mosqueId } = payload;

  const isUserExist = await prisma.admin.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "Admin already exists with this email",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.create({
    data: {
      name,
      email,
      password: hashedPassword,
      mosqueId,
      role: "MOSQUE_ADMIN",
    },
    select: userSafeSelect,
  });

  const accessToken = tokenHelpers.getAccessToken({
    userId: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.name,
    mosqueId: admin.mosqueId,
  });

  const refreshToken = tokenHelpers.getRefreshToken({
    userId: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.name,
    mosqueId: admin.mosqueId,
  });

  return {
    user: admin,
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  if (!admin.isActive) {
    throw new AppError(status.FORBIDDEN, "Admin account is inactive");
  }

  const isPasswordMatch = await bcrypt.compare(password, admin.password);

  if (!isPasswordMatch) {
    throw new AppError(status.UNAUTHORIZED, "Invalid password");
  }

  const accessToken = tokenHelpers.getAccessToken({
    userId: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.name,
    mosqueId: admin.mosqueId,
  });

  const refreshToken = tokenHelpers.getRefreshToken({
    userId: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.name,
    mosqueId: admin.mosqueId,
  });

  // Omit password from the returned admin object
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...adminWithoutPassword } = admin;

  return {
    user: adminWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const authService = {
  registerUser,
  loginUser,
};

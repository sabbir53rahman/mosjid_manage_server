import { prisma } from "../../lib/prisma.js";
import { userSafeSelect } from "./user.constants.js";

const getMyProfile = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...userSafeSelect,
    },
  });
  return result;
};

export const UserService = {
  getMyProfile,
};

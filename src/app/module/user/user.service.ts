import { prisma } from "../../lib/prisma";
import { userSafeSelect } from "./user.constants";

const getMyProfile = async (userId: string) => {
  const result = await prisma.admin.findUnique({
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

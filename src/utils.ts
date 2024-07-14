import { PrismaClient } from "@prisma/client";

export const validateUserModel = async (
  prisma: PrismaClient
): Promise<boolean> => {
  try {
    const user = await prisma.user.findFirst();
    return user !== null;
  } catch (error) {
    return false;
  }
};

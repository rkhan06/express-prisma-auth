import { PrismaClient } from "@prisma/client";

export const validateUserModel = async (
  prisma: PrismaClient,
): Promise<boolean> => {
  try {
    const modelExists = await prisma.$queryRaw`
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'users'
    `;

    if (modelExists.length === 0) {
      return false;
    }

    // Check for the necessary fields in the User model
    const userFields = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
    `;

    const requiredFields = ["email", "password"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldNames = userFields.map((field: any) => field.column_name);

    for (const field of requiredFields) {
      if (!fieldNames.includes(field)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error validating User model:", error);
    return false;
  }
};

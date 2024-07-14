import jwt from "jsonwebtoken";

export const generateToken = (userId: number, jwtSecret: string) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "1h" });
};

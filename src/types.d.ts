import jwt from "jsonwebtoken";
export interface User {
  id: number | string;
  email?: string;
  password: string;
  [key: string]: unknown;
}

export interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: number | string;
}

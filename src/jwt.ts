import jwt from "jsonwebtoken";

export const generateToken = (
  userId: number | string,
  jwtSecret: string,
  refreshSecret: string,
) => {
  const accessToken = jwt.sign({ userId }, jwtSecret, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string, refreshSecret: string) => {
  return jwt.verify(token, refreshSecret);
};

export const regenerateAccessToken = (
  userId: number | string,
  jwtSecret: string,
) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "1h" });
};

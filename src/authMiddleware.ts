import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

type AuthRequest = {
  user?: string | JwtPayload;
};

export const authMiddleware =
  (jwtSecret: string) => (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Not Authorized" });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      (req as AuthRequest).user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid Token" });
    }
  };

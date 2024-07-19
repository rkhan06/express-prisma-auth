import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  generateToken,
  verifyRefreshToken,
  regenerateAccessToken,
} from "./jwt";
import { JwtPayloadWithUserId } from "./types";

export const signup =
  (prisma: PrismaClient) =>
  async (req: Request, res: Response) => {
    const { email, password, ...rest } = req.body;

    if (!email) {
      return res.status(400).json({ error: `Email is required` });
    }

    if (!password) {
      return res.status(400).json({ error: `Password is required` });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          ...rest,
        },
      });

      res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "User sign up failed" });
    }
  };

export const login =
  (prisma: PrismaClient, jwtSecret: string, refreshSecret: string) =>
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      const { accessToken, refreshToken } = generateToken(
        user.id,
        jwtSecret,
        refreshSecret,
      );
      res.status(200).json({ success: true, data: { token: accessToken, refreshToken} });
    } catch (error) {
      res.status(500).json({ success: false, message: "User login failed" });
    }
  };

export const refreshToken =
  (prisma: PrismaClient, jwtSecret: string, refreshSecret: string) =>
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    try {
      const decoded = verifyRefreshToken(
        refreshToken,
        refreshSecret,
      ) as JwtPayloadWithUserId;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const newAccessToken = regenerateAccessToken(user.id, jwtSecret);

      res.json({ success: true, data: { token: newAccessToken }});
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  };

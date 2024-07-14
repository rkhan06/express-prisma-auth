import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "./jwt";

export const register =
  (
    prisma: PrismaClient,
    jwtSecret: string,
    identifierField: "email" | "username"
  ) =>
  async (req: Request, res: Response) => {
    const { email, username, password, ...rest } = req.body;
    const identifierValue = identifierField === "email" ? email : username;

    if (!identifierValue) {
      return res.status(400).json({ error: `Missing ${identifierField}` });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          [identifierField]: identifierValue,
          password: hashedPassword,
          ...rest,
        },
      });

      const token = generateToken(user.id, jwtSecret);
      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ error: "User registration failed" });
    }
  };

export const login =
  (
    prisma: PrismaClient,
    jwtSecret: string,
    identifierField: "email" | "username"
  ) =>
  async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    const identifierValue = identifierField === "email" ? email : username;

    if (!identifierValue) {
      return res.status(400).json({ error: `Missing ${identifierField}` });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { [identifierField]: identifierValue },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user.id, jwtSecret);
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "User login failed" });
    }
  };

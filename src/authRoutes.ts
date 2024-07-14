import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { register, login } from "./authController";

export interface AuthRoutesConfig {
  register: string;
  login: string;
}

const authRoutes = (
  router: Router,
  prisma: PrismaClient,
  jwtSecret: string,
  routes: AuthRoutesConfig,
  identifierField: "email" | "username"
) => {
  router.post(routes.register, register(prisma, jwtSecret, identifierField));
  router.post(routes.login, login(prisma, jwtSecret, identifierField));
};

export default authRoutes;

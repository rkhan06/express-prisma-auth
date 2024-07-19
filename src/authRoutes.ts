import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { signup, login, refreshToken } from "./authController";

export interface AuthRoutesConfig {
  signup: string;
  login: string;
  refreshToken: string;
}

const authRoutes = (
  router: Router,
  prisma: PrismaClient,
  jwtSecret: string,
  refreshSecret: string,
  routes: AuthRoutesConfig,
) => {
  router.post(routes.signup, signup(prisma));
  router.post(routes.login, login(prisma, jwtSecret, refreshSecret));
  router.post(
    routes.refreshToken,
    refreshToken(prisma, jwtSecret, refreshSecret),
  );
};

export default authRoutes;

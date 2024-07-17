import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import authRoutes, { AuthRoutesConfig } from "./authRoutes";
import { validateUserModel } from "./utils";
import { authMiddleware } from "./authMiddleware";

export interface AuthLibraryOptions {
  jwtSecret: string;
  refreshSecret: string;
}

export class AuthLibrary {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private refreshSecret: string;
  private routes: AuthRoutesConfig;

  constructor(prisma: PrismaClient, options: AuthLibraryOptions) {
    this.prisma = prisma;
    this.jwtSecret = options.jwtSecret;
    this.refreshSecret = options.refreshSecret;
    this.routes = {
      signup: "/signup",
      login: "/login",
      refreshToken: "/refresh-token",
    };

    // Validate if the User model exists and contains the necessary fields
    validateUserModel(prisma)
      .then((exists) => {
        if (!exists) {
          throw new Error(
            `User model does not exist or does not contain the required fields (email, password). Please define it in your Prisma schema.`,
          );
        }
      })
      .catch((err) => {
        throw new Error(`Error validating User model: ${err.message}`);
      });
  }

  public getAuthRoutes(): Router {
    const router = Router();
    authRoutes(
      router,
      this.prisma,
      this.jwtSecret,
      this.refreshSecret,
      this.routes,
    );
    return router;
  }

  public getAuthMiddleware() {
    return authMiddleware(this.jwtSecret);
  }
}

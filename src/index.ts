import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import authRoutes, { AuthRoutesConfig } from "./authRoutes";
import { validateUserModel } from "./utils";

export interface AuthLibraryOptions {
  jwtSecret: string;
  routes?: AuthRoutesConfig;
  identifierField: "email" | "username";
}

export class AuthLibrary {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private routes: AuthRoutesConfig;
  private identifierField: "email" | "username";

  constructor(prisma: PrismaClient, options: AuthLibraryOptions) {
    this.prisma = prisma;
    this.jwtSecret = options.jwtSecret;
    this.routes = options.routes || {
      register: "/register",
      login: "/login",
    };
    this.identifierField = options.identifierField;

    // Validate if the User model exists and contains the necessary fields
    validateUserModel(prisma, this.identifierField)
      .then((exists) => {
        if (!exists) {
          throw new Error(
            `User model does not exist or does not contain the required fields (${this.identifierField}, password). Please define it in your Prisma schema.`
          );
        }
      })
      .catch((err) => {
        throw new Error(`Error validating User model: ${err.message}`);
      });
  }

  public getMiddleware(): Router {
    const router = Router();
    authRoutes(
      router,
      this.prisma,
      this.jwtSecret,
      this.routes,
      this.identifierField
    );
    return router;
  }
}

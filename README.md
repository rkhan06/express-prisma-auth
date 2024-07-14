# express-prisma-auth

`express-prisma-auth` is an authentication library for Node.js applications using Express and Prisma ORM. It provides an out-of-the-box solution for handling user authentication with JWT.

## Installation

Install the package via npm:

```bash
npm install express-prisma-auth
```

## Requirements

- Node.js
- Prisma ORM
- Express.js
- A PostgreSQL database (or any database supported by Prisma)

## Methods

### `AuthLibrary`

The main class to set up and use the authentication library.

#### Constructor

```typescript
constructor(prisma: PrismaClient, options: AuthLibraryOptions)
```

- `prisma`: An instance of the PrismaClient.
- `options`: Configuration options for the authentication library.

#### Options

The `AuthLibrary` constructor accepts an `AuthLibraryOptions` object with the following properties:

- `jwtSecret` (string, required): Secret key for signing JWT tokens. This is used to encrypt and decrypt the JWT tokens. Ensure this key is kept secure.
- `routes` (object, optional): Custom routes for registration and login. This allows you to define custom endpoint paths for user registration and login.
  - `register` (string, optional): The route path for user registration. Default is `'/register'`.
  - `login` (string, optional): The route path for user login. Default is `'/login'`.
- `identifierField` (string, required): Field used for user identification, either `'email'` or `'username'`. This determines whether the user will register and login using an email address or a username.

## Example User Schema

Define the `User` model in your Prisma schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int    @id @default(autoincrement())
  email     String @unique
  username  String
  password  String
  firstName String
  lastName  String
}
```

## Usage

Here is a simple example of how to use `express-prisma-auth` in an Express application:

### Prisma Client Initialization

Ensure you have initialized Prisma in your project and have a valid `prisma.schema` file as shown above. Run the following command to apply migrations:

```bash
npx prisma migrate dev --name init
```

### Example Express App

```typescript
import { PrismaClient } from "@prisma/client";
import express, { Application, Request, Response } from "express";
import { AuthLibrary } from "express-prisma-auth";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.use(express.json());

const prismaClient = new PrismaClient();
const authLibrary = new AuthLibrary(prismaClient, {
  jwtSecret: process.env.JWT_SECRET || "secret",
  routes: {
    register: "/signup",
    login: "/signin",
  },
  identifierField: "email", // or 'username'
});

// Use the authentication routes
app.use("/api/auth", authLibrary.getAuthRoutes());

// Protect your routes using the authentication middleware
app.get(
  "/api/protected",
  authLibrary.getAuthMiddleware(),
  (req: Request, res: Response) => {
    res.send("Hello, authenticated user!");
  }
);

app.listen(5001, () => {
  console.log("App listening on port 5001");
});

export default app;
```

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, username } from "better-auth/plugins";
import { hashPasswordFunction, verifyPasswordFunction } from "./argon2";
import { customAc, superAdmin, user } from "./authPermissions";
import prisma from "./database/dbClient";
import { serverEnv } from "./env/serverEnv";

export const auth = betterAuth({
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "sqlite", // or "mysql", "postgresql", ...etc
  }),

  rateLimit: {
    enabled: true,
    window: 120, // time window in seconds
    max: 10, // max requests in the window
    customRules: {
      "/sign-in/email": {
        window: 60,
        max: 2,
      },
      "/sign-up/email": {
        window: 60,
        max: 1,
      },
    },
    storage: "database",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
    password: {
      hash: hashPasswordFunction,
      verify: verifyPasswordFunction,
    },
  },
  plugins: [
    nextCookies(),
    username(),
    admin({
      ac: customAc,
      adminRoles: ["ADMIN"],
      defaultRole: "USER",
      roles: { ADMIN: superAdmin, USER: user },
    }),
  ],

  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    deleteUser: {
      enabled: true,
    },
  },
});

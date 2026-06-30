import { hash, verify } from "@node-rs/argon2";
import { serverEnv } from "./env/serverEnv";

// Type definition for password verification input.
type VerifyPasswordType = {
  hash: string;
  password: string;
};

//   Hashes a plain text password using Argon2
export const hashPasswordFunction = async (password: string) => {
  const hashedPassword = await hash(password, {
    secret: Buffer.from(serverEnv.BETTER_AUTH_SECRET),
  });

  return hashedPassword;
};

// Verifies a plain text password against a hashed password
export const verifyPasswordFunction = async (data: VerifyPasswordType) => {
  const { hash, password } = data;

  const varifiedPassword = await verify(hash, password, {
    secret: Buffer.from(serverEnv.BETTER_AUTH_SECRET),
  });

  return varifiedPassword;
};

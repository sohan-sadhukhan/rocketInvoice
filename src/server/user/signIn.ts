"use server";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { signInSchema, type SignInInput } from "@/lib/zodSchema";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";

export const signIn = async (
  input: SignInInput,
): Promise<ApiResponse<{ email: string }>> => {
  const parsed = signInSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
    });

    return {
      success: true,
      data: { email: parsed.data.email },
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};

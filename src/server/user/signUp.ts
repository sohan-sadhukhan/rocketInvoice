"use server";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { signUpSchema, type SignUpInput } from "@/lib/zodSchema";
import { APIError } from "better-auth/api";

export const signUp = async (
  input: SignUpInput,
): Promise<ApiResponse<{ email: string }>> => {
  const parsed = signUpSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      },
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

"use server";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { z } from "zod";

const changeEmailSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export const changeEmail = async (input: {
  email: string;
}): Promise<ApiResponse<{ email: string }>> => {
  const parsed = changeEmailSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    await auth.api.changeEmail({
      body: {
        newEmail: parsed.data.email,
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

"use server";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const changePassword = async (input: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<{ success: boolean }>> => {
  const parsed = changePasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      },
      headers: await headers(),
    });

    return {
      success: true,
      data: { success: true },
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

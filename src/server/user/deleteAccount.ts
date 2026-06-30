"use server";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { z } from "zod";

const deleteAccountSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});

export const deleteAccount = async (input: {
  password: string;
}): Promise<ApiResponse<{ success: boolean }>> => {
  const parsed = deleteAccountSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    await auth.api.deleteUser({
      body: {
        password: parsed.data.password,
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

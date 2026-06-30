"use server";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { z } from "zod";

const changeNameSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const changeName = async (input: {
  name: string;
}): Promise<ApiResponse<{ name: string }>> => {
  const parsed = changeNameSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    await auth.api.updateUser({
      body: {
        name: parsed.data.name,
      },
      headers: await headers(),
    });

    return {
      success: true,
      data: { name: parsed.data.name },
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

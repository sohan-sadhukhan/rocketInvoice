"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { ApiResponse } from "@/lib/types";
import {
  createBusinessSchema,
  type CreateBusinessInput,
} from "@/lib/zodSchema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const createBusiness = async (
  input: CreateBusinessInput,
): Promise<ApiResponse<{ id: string }>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "You must be signed in to create a business." };
  }

  const parsed = createBusinessSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    const business = await prisma.business.create({
      data: {
        name: parsed.data.name,
        address: parsed.data.address,
        contactInformation: parsed.data.contactInformation,
        userId: session.user.id,
      },
    });

    revalidatePath("/business");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { id: business.id },
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};

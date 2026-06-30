"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { ApiResponse } from "@/lib/types";
import {
  createProductFamilySchema,
  type CreateProductFamilyInput,
} from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createProductFamily = async (
  input: CreateProductFamilyInput,
): Promise<ApiResponse<{ id: string }>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "You must be signed in to create a product family.",
    };
  }

  const parsed = createProductFamilySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  // Validate selected business belongs to the current user
  const business = await prisma.business.findFirst({
    where: {
      id: parsed.data.businessId,
      userId: session.user.id,
      deletedAt: null,
    },
  });

  if (!business) {
    return {
      success: false,
      error: "Selected business not found or you don't have access.",
    };
  }

  try {
    const family = await prisma.productFamily.create({
      data: {
        name: parsed.data.name,
        businessId: parsed.data.businessId,
      },
    });

    revalidatePath("/products");
    revalidatePath("/products/create");

    return {
      success: true,
      data: { id: family.id },
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};

"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { ApiResponse } from "@/lib/types";
import { createProductSchema, type CreateProductInput } from "@/lib/zodSchema";
import { Prisma } from "@generated/prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createProduct = async (
  input: CreateProductInput,
): Promise<ApiResponse<{ id: string }>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "You must be signed in to create a product.",
    };
  }

  const parsed = createProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const business = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      currentBusinessId: true,
    },
  });

  if (!business?.currentBusinessId) {
    return {
      success: false,
      error: "Create a business before adding products.",
    };
  }

  const taxRate = await prisma.taxRate.findFirst({
    where: {
      id: parsed.data.taxRateId,
      businessId: business.currentBusinessId,
      deletedAt: null,
    },
    select: {
      id: true,
      percent: true,
    },
  });

  if (!taxRate) {
    return {
      success: false,
      error: "Select a valid tax rate before creating the product.",
    };
  }

  const family = await prisma.productFamily.findFirst({
    where: {
      id: parsed.data.familyId,
      businessId: business.currentBusinessId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!family) {
    return {
      success: false,
      error: "Select a valid family before creating the product.",
    };
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        taxRate: new Prisma.Decimal(taxRate.percent),
        price: new Prisma.Decimal(parsed.data.price),
        family: family.name,
        familyId: family.id,
        businessId: business.currentBusinessId,
      },
    });

    revalidatePath("/products");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { id: product.id },
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};

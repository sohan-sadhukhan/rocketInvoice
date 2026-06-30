"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { ApiResponse } from "@/lib/types";
import { createTaxRateSchema, type CreateTaxRateInput } from "@/lib/zodSchema";
import { Prisma } from "@generated/prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createTaxRate = async (
  input: CreateTaxRateInput,
): Promise<ApiResponse<{ id: string }>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "You must be signed in to create a tax rate.",
    };
  }

  const parsed = createTaxRateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

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
      error: "Select a valid business before adding tax rates.",
    };
  }

  try {
    const taxRate = await prisma.taxRate.create({
      data: {
        name: parsed.data.name,
        percent: new Prisma.Decimal(parsed.data.percent),
        businessId: business.id,
      },
    });

    revalidatePath("/taxrate");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { id: taxRate.id },
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};

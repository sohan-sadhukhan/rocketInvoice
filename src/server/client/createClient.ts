"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { ApiResponse } from "@/lib/types";
import { createClientSchema, type CreateClientInput } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createClient = async (
  input: CreateClientInput,
): Promise<ApiResponse<{ id: string }>> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      success: false,
      error: "You must be signed in to create a client.",
    };
  }

  const parsed = createClientSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  // validate that provided businessId belongs to the user
  const business = await prisma.business.findFirst({
    where: {
      id: (parsed as any).data.businessId,
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
    const client = await prisma.client.create({
      data: {
        name: parsed.data.name,
        address: parsed.data.address,
        contactInformation: parsed.data.contactInformation,
        gender: parsed.data.gender ?? null,
        birthdate:
          parsed.data.birthdate ? new Date(parsed.data.birthdate) : null,
        businessId: (parsed as any).data.businessId,
      },
    });

    revalidatePath("/clients");

    return { success: true, data: { id: client.id } };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
};

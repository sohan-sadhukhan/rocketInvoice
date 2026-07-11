"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export const updateCurrentBusiness = async (businessId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      success: false,
      error: "You must be signed in to switch businesses.",
    };
  }

  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      userId: session.user.id,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!business?.id) {
    return {
      success: false,
      error: "Business not found or access denied.",
    };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        currentBusinessId: business.id,
      },
    });

    return {
      success: true,
      data: updatedUser.currentBusinessId,
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};

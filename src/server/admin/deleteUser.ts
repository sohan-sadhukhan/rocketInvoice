"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const deleteUser = async (userId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (userId === session.user.id) {
    return {
      success: false,
      message: "Cannot delete yourself",
    };
  }

  try {
    // Soft delete the user and their businesses

    await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath("/admin");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete user",
    };
  }
};

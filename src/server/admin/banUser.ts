"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { isAPIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Better Auth ban user error messages
const BETTER_AUTH_BAN_ERROR_MESSAGES: Record<string, string> = {
  user_not_found: "User not found.",
  unauthorized: "You are not authorized to perform this action.",
  forbidden: "You do not have permission to ban/unban users.",
  user_already_banned: "User is already banned.",
  user_not_banned: "User is not banned.",
  internal_server_error: "Auth server error. Please try again.",
};

const banUser = async (userId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/auth/signin");
    }

    if (session.user.role !== "ADMIN") {
      redirect("/auth/signin");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    try {
      if (user?.banned) {
        await auth.api.unbanUser({
          body: {
            userId: userId,
          },
          headers: await headers(),
        });

        revalidatePath("/admin");

        return {
          success: true,
          message: "User Unbanned successfully",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to Unban user",
      };
    }

    try {
      await auth.api.banUser({
        body: {
          userId: userId,
          banReason: "Spamming",
          banExpiresIn: 60 * 60 * 24 * 7,
        },
        headers: await headers(),
      });

      revalidatePath("/admin");

      return {
        success: true,
        message: "User banned successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to ban user",
      };
    }
  } catch (error) {
    if (isAPIError(error)) {
      const code = error.body?.code?.toLowerCase();

      if (code && BETTER_AUTH_BAN_ERROR_MESSAGES[code]) {
        return {
          success: false,
          message: BETTER_AUTH_BAN_ERROR_MESSAGES[code],
        };
      }
    }

    return {
      success: false,
      message: "Something went wrong while updating user ban status.",
    };
  }
};

export default banUser;

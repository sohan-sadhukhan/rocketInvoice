"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getAllUsers = async (cursor: string | null) => {
  const limit = 10;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const users = await prisma.user.findMany({
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor,
      },
    }),
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      createdAt: true,
      _count: {
        select: {
          businesses: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const hasNextPage = users.length > limit;

  const paginatedItems = hasNextPage ? users.slice(0, limit) : users;

  const nextCursor =
    hasNextPage ? paginatedItems[paginatedItems.length - 1].id : null;

  return {
    data: paginatedItems,
    nextCursor,
  };
};

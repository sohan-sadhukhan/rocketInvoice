"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { ApiResponse } from "@/lib/types";
import { createInvoiceSchema, type CreateInvoiceInput } from "@/lib/zodSchema";
import Decimal from "decimal.js";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createInvoice = async (
  input: CreateInvoiceInput,
): Promise<ApiResponse<{ id: string }>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "You must be signed in to create an invoice.",
    };
  }

  const parsed = createInvoiceSchema.safeParse(input);

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
      error: "Selected business not found or you don't have access.",
    };
  }

  let clientId = parsed.data.clientId ?? null;

  if (!clientId) {
    const client = await prisma.client.create({
      data: {
        name: parsed.data.clientName,
        address: parsed.data.clientAddress,
        contactInformation: parsed.data.clientContactInformation,
        gender: null,
        birthdate: null,
        businessId: business.currentBusinessId,
      },
    });

    clientId = client.id;
  }

  const items = parsed.data.items.map((item) => {
    const quantity = new Decimal(item.quantity);
    const price = new Decimal(item.price);
    const discount = new Decimal(item.discount);
    const taxRate = new Decimal(item.taxRate);

    const lineTotal = quantity
      .mul(price)
      .minus(discount)
      .plus(quantity.mul(price).mul(taxRate).div(100));

    return {
      productId: item.productId ?? null,
      name: item.name,
      quantity,
      price,
      discount,
      taxRate,
      lineTotal,
    };
  });

  const subtotal = items.reduce(
    (acc, item) => acc.plus(item.quantity.mul(item.price)),
    new Decimal(0),
  );

  const itemDiscount = items.reduce(
    (acc, item) => acc.plus(item.discount),
    new Decimal(0),
  );

  const taxTotal = items.reduce(
    (acc, item) =>
      acc.plus(item.quantity.mul(item.price).mul(item.taxRate).div(100)),
    new Decimal(0),
  );

  const total = subtotal
    .minus(itemDiscount)
    .plus(taxTotal)
    .minus(new Decimal(parsed.data.globalDiscount));

  try {
    const invoice = await prisma.invoice.create({
      data: {
        invoiceDate: new Date(parsed.data.invoiceDate),
        status: parsed.data.status,
        paymentMethod: parsed.data.paymentMethod,

        clientId,
        clientName: parsed.data.clientName ?? "",
        clientAddress: parsed.data.clientAddress ?? "",
        clientContactInformation: parsed.data.clientContactInformation ?? "",

        businessId: business.currentBusinessId,

        globalDiscount: new Decimal(parsed.data.globalDiscount),

        subtotal,
        itemDiscount,
        taxTotal,
        total,

        invoiceItems: {
          create: items,
        },
      },
      include: {
        invoiceItems: true,
      },
    });

    revalidatePath("/invoices");

    return {
      success: true,
      data: {
        id: invoice.id,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};

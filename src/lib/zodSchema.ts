import z from "zod";

export const signInSchema = z.object({
  email: z
    .email({ error: "Enter a valid email address" })
    .min(1, { error: "Email is required" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" })
    .max(128, { error: "Password must be at most 128 characters" }),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { error: "Name is required" })
      .max(100, { error: "Name must be at most 100 characters" }),
    email: z
      .email({ error: "Enter a valid email address" })
      .min(1, { error: "Email is required" }),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .max(128, { error: "Password must be at most 128 characters" }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

const decimalStringSchema = (label: string) =>
  z
    .string()
    .min(1, { error: `${label} is required` })
    .refine(
      (value) => {
        const parsed = Number(value);
        return !Number.isNaN(parsed) && parsed >= 0;
      },
      { error: `Enter a valid ${label.toLowerCase()}` },
    );

export const createBusinessSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Business name is required" })
    .max(200, { error: "Business name must be at most 200 characters" }),
  address: z
    .string()
    .min(1, { error: "Address is required" })
    .max(500, { error: "Address must be at most 500 characters" }),
  contactInformation: z
    .string()
    .min(1, { error: "Contact information is required" })
    .max(500, { error: "Contact information must be at most 500 characters" }),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;

export const createProductFamilySchema = z.object({
  name: z
    .string()
    .min(1, { error: "Family name is required" })
    .max(100, { error: "Family name must be at most 100 characters" }),
});

export type CreateProductFamilyInput = z.infer<
  typeof createProductFamilySchema
>;

export const createClientSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Client name is required" })
    .max(200, { error: "Client name must be at most 200 characters" }),
  address: z
    .string()
    .min(1, { error: "Address is required" })
    .max(500, { error: "Address must be at most 500 characters" }),
  contactInformation: z
    .string()
    .min(1, { error: "Contact information is required" })
    .max(500, { error: "Contact information must be at most 500 characters" }),
  gender: z.string().optional(),
  birthdate: z.date().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

const invoiceItemSchema = z.object({
  productId: z.string().optional(),
  name: z
    .string()
    .min(1, { error: "Product name is required" })
    .max(200, { error: "Product name must be at most 200 characters" }),
  quantity: z
    .string()
    .min(1, { error: "Quantity is required" })
    .refine(
      (value) => {
        const parsed = Number(value);
        return !Number.isNaN(parsed) && parsed > 0;
      },
      { error: "Quantity must be a positive number" },
    ),
  price: decimalStringSchema("Price"),
  discount: decimalStringSchema("Discount"),
  taxRate: decimalStringSchema("Tax rate"),
});

export const createInvoiceSchema = z
  .object({
    invoiceDate: z.date().min(1, { error: "Invoice date is required" }),
    status: z.enum(["draft", "sent", "paid", "cancelled"]),
    paymentMethod: z.enum(["cash", "online"]),
    clientId: z.string().optional(),
    clientName: z.string(),
    clientAddress: z.string(),
    clientContactInformation: z.string(),
    items: z
      .array(invoiceItemSchema)
      .min(1, { error: "At least one invoice item is required" }),
    globalDiscount: decimalStringSchema("Global discount"),
  })
  .superRefine((data, ctx) => {
    if (!data.clientId) {
      if (!data.clientName?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["clientName"],
          message: "Client name is required when no client is selected",
        });
      }

      if (!data.clientContactInformation?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["clientContactInformation"],
          message: "Contact information is required when no client is selected",
        });
      }

      if (!data.clientAddress?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["clientAddress"],
          message: "Address is required when no client is selected",
        });
      }
    }
  });

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Product name is required" })
    .max(200, { error: "Product name must be at most 200 characters" }),
  description: z
    .string()
    .max(1000, { error: "Description must be at most 1000 characters" })
    .optional(),
  taxRateId: z.string(),
  price: decimalStringSchema("Price"),
  familyId: z.string().min(1, { error: "Family is required" }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const createTaxRateSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Tax rate name is required" })
    .max(100, { error: "Tax rate name must be at most 100 characters" }),
  percent: z
    .string()
    .min(1, { error: "Tax rate percent is required" })
    .refine(
      (value) => {
        const parsed = Number(value);
        return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 100;
      },
      { error: "Tax rate percent must be between 0 and 100" },
    ),
});

export type CreateTaxRateInput = z.infer<typeof createTaxRateSchema>;

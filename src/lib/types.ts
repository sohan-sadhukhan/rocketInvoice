import { ReactNode } from "react";

export type LayoutChildrenProps = Readonly<{
  children: ReactNode;
}>;

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type InvoiceListItem = {
  id: string;
  invoiceDate: Date;
  status: string;
  paymentMethod: string;
  clientName: string;
  clientAddress: string;
  clientContactInformation: string;
  total: number;
  createdAt: Date;
  invoiceItems: {
    id: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    invoiceId: string;
    productId: string | null;
    quantity: number;
    price: number;
    discount: number;
    taxRate: number;
    lineTotal: number;
  }[];
};

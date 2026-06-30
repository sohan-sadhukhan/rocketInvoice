import { ReactNode } from "react";

export type LayoutChildrenProps = Readonly<{
  children: ReactNode;
}>;

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

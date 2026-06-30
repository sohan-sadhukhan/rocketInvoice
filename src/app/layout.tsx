import ThemeProvider from "@/components/Providers/ThemeProvider";
import ToastProvider from "@/components/Providers/ToastProvider";
import { notoSansHeading, nunitoSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        "font-sans",
        nunitoSans.variable,
        notoSansHeading.variable,
      )}
      suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          enableSystem={false}>
          <ToastProvider />

          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

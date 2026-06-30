import Header from "@/components/Header/Header";
import { LayoutChildrenProps } from "@/lib/types";

const AuthLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        {children}
      </div>
    </>
  );
};

export default AuthLayout;

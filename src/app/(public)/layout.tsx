import { Footer } from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { LayoutChildrenProps } from "@/lib/types";

const PublicLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <>
      <Header />
      <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-12">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default PublicLayout;

import ProductFamilyList from "@/components/Product/ProductFamilyList";
import { getProductFamilies } from "@/server/product/getProductFamilies";

const ProductFamiliesPage = async () => {
  const families = await getProductFamilies(null);

  return (
    <section className="space-y-6">
      <ProductFamilyList
        families={families.data}
        nextCursor={families.nextCursor}
      />
    </section>
  );
};

export default ProductFamiliesPage;

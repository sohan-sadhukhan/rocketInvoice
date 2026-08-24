import ProductFamilyList from "@/components/Product/ProductFamilyList";
import { getProductFamilies } from "@/server/product/getProductFamilies";
import getProductFamilyCounts from "@/server/product/getProductFamilyCounts";

const ProductFamiliesPage = async () => {
  const [families, productFamilyCounts] = await Promise.all([
    getProductFamilies(null),
    getProductFamilyCounts(),
  ]);
  return (
    <section className="space-y-6">
      <ProductFamilyList
        families={families.data}
        nextCursor={families.nextCursor}
        productFamilyCounts={productFamilyCounts}
      />
    </section>
  );
};

export default ProductFamiliesPage;

import AllProducts from "@/components/Product/AllProducts";
import getProductCounts from "@/server/product/getProductCounts";
import { getProducts } from "@/server/product/getProducts";

const ProductsPage = async () => {
  const [products, productCounts] = await Promise.all([
    getProducts(null),
    getProductCounts(),
  ]);
  return (
    <section className="space-y-6">
      <AllProducts
        products={products.data}
        nextCursor={products.nextCursor}
        productCounts={productCounts}
      />
    </section>
  );
};

export default ProductsPage;

import AllProducts from "@/components/Product/AllProducts";
import { getProducts } from "@/server/product/getProducts";

const ProductsPage = async () => {
  const products = await getProducts(null);

  return (
    <section className="space-y-6">
      <AllProducts
        products={products.data}
        nextCursor={products.nextCursor}
      />
    </section>
  );
};

export default ProductsPage;

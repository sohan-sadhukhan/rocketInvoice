import CreateProduct from "@/components/Product/CreateProduct";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";

const CreateProductPage = () => {
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create product</CardTitle>
        <CardDescription>
          Add a new product to your first registered business.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateProduct />
      </CardContent>
    </Card>
  );
};

export default CreateProductPage;

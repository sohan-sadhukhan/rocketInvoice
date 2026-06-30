import CreateProductFamilyForm from "@/components/Product/CreateProductFamilyForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";

const CreateProductFamilyPage = () => {
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create product family</CardTitle>
        <CardDescription>
          Create a reusable family for grouping your products.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateProductFamilyForm />
      </CardContent>
    </Card>
  );
};

export default CreateProductFamilyPage;

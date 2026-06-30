import CreateBusiness from "@/components/Business/CreateBusiness";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";

const CreateBusinessPage = () => {
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create business</CardTitle>
        <CardDescription>
          Add a new business profile to manage your invoices and products.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateBusiness />
      </CardContent>
    </Card>
  );
};

export default CreateBusinessPage;

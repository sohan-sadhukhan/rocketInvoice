import CreateInvoiceForm from "@/components/Invoice/CreateInvoiceForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";

const CreateInvoicePage = () => {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Create invoice</CardTitle>
          <CardDescription>
            Build a new invoice with existing clients, products, and discounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateInvoiceForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateInvoicePage;

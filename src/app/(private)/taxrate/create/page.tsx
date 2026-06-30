import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import CreateTaxRateForm from "@/components/TaxRate/CreateTaxRateForm";

const CreateTaxRatePage = () => {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-semibold">Create tax rate</h1>
        <p className="text-muted-foreground">
          Add a new tax rate for your business.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax rate details</CardTitle>
          <CardDescription>
            Enter the label and percentage for the tax rate you want to use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTaxRateForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateTaxRatePage;

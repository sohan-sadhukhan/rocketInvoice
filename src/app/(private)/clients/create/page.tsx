import CreateClientForm from "@/components/Client/CreateClientForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";

const CreateClientPage = () => {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create client</CardTitle>
          <CardDescription>Add a new client to your business.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CreateClientForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateClientPage;

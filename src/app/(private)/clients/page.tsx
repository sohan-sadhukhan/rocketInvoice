import AllClints from "@/components/Client/AllClints";
import { getClients } from "@/server/client/getClients";

const ClientsPage = async () => {
  const clients = await getClients(null);

  return (
    <section className="space-y-6">
      <AllClints
        clients={clients.data}
        nextCursor={clients.nextCursor}
      />
    </section>
  );
};

export default ClientsPage;

import AllClints from "@/components/Client/AllClints";
import getClientCounts from "@/server/client/getClientCounts";
import { getClients } from "@/server/client/getClients";

const ClientsPage = async () => {
  const [clients, clientCounts] = await Promise.all([
    getClients(null),
    getClientCounts(),
  ]);

  return (
    <section className="space-y-6">
      <AllClints
        clients={clients.data}
        nextCursor={clients.nextCursor}
        clientCounts={clientCounts}
      />
    </section>
  );
};

export default ClientsPage;

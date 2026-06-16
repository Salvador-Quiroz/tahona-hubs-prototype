import { AccountPage } from "@/components/cliente/customer-pages";

export default function Page({ params }: { params: { id: string } }) {
  return <AccountPage view="entrega" entregaId={params.id} />;
}

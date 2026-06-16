import { OperatorPage } from "@/components/operador/operator-pages";

export default function Page({ params }: { params: { id: string } }) {
  return <OperatorPage view="suscripcion" id={params.id} />;
}

import { HubDetailPage } from "@/components/cliente/customer-pages";

export default function Page({ params }: { params: { slug: string } }) {
  return <HubDetailPage slug={params.slug} />;
}

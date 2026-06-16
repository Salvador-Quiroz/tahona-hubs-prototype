import { ProductDetailPage } from "@/components/cliente/customer-pages";

export default function Page({ params }: { params: { slug: string } }) {
  return <ProductDetailPage slug={params.slug} />;
}

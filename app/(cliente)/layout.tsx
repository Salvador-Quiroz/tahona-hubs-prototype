import { ClienteShell } from "@/components/shared/app-shells";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return <ClienteShell>{children}</ClienteShell>;
}

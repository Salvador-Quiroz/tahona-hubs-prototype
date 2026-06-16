import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.replaceAll("_", " ");
  const variant =
    status.includes("activo") ||
    status.includes("activa") ||
    status.includes("cobrado") ||
    status.includes("entregado") ||
    status.includes("resuelta")
      ? "success"
      : status.includes("pendiente") ||
          status.includes("paus") ||
          status.includes("proceso") ||
          status.includes("listo")
        ? "warning"
        : status.includes("fallido") || status.includes("incidencia")
          ? "secondary"
          : "soft";

  return (
    <Badge variant={variant} className="capitalize">
      {normalized}
    </Badge>
  );
}

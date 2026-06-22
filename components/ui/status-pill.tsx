import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  XCircle,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const toneClass: Record<StatusTone, string> = {
  success: "border-success/20 bg-success-bg text-success",
  warning: "border-warning/30 bg-warning-bg text-warning",
  danger: "border-danger/20 bg-danger-bg text-danger",
  info: "border-info/20 bg-info-bg text-info",
  neutral: "border-border bg-muted text-muted-foreground"
};

const toneIcon: Record<StatusTone, LucideIcon> = {
  success: CheckCircle2,
  warning: Clock,
  danger: XCircle,
  info: Info,
  neutral: AlertTriangle
};

type StatusPillProps = {
  label: string;
  tone?: StatusTone;
  icon?: LucideIcon;
  className?: string;
};

export function StatusPill({ label, tone = "neutral", icon, className }: StatusPillProps) {
  const Icon = icon ?? toneIcon[tone];

  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center gap-2 rounded-full border px-xs text-sm font-semibold",
        toneClass[tone],
        className
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </span>
  );
}

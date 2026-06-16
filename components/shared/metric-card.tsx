import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon?: LucideIcon;
  tone?: "default" | "warm" | "green" | "gold";
};

const toneClass = {
  default: "bg-tahona-ink text-white",
  warm: "bg-tahona-terracotta text-white",
  green: "bg-tahona-nopal text-white",
  gold: "bg-tahona-maiz text-tahona-ink"
};

export function MetricCard({ label, value, helper, icon: Icon, tone = "default" }: MetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
            {helper ? <p className="mt-2 text-sm text-muted-foreground">{helper}</p> : null}
          </div>
          {Icon ? (
            <div className={cn("rounded-md p-3", toneClass[tone])}>
              <Icon className="h-5 w-5" aria-hidden />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

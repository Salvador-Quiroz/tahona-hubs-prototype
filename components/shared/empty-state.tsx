import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: string;
};

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed bg-card p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-secondary" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {action ? (
        <Button className="mt-5" variant="secondary">
          {action}
        </Button>
      ) : null}
    </div>
  );
}

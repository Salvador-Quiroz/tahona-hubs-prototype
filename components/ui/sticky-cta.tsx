import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StickyCTAProps = {
  label: string;
  helper?: string;
  price?: string;
  buttonProps?: ButtonProps;
  className?: string;
};

export function StickyCTA({ label, helper, price, buttonProps, className }: StickyCTAProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-sm py-xs pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur-xl md:hidden",
        className
      )}
    >
      <div className="mx-auto flex max-w-xl items-center gap-sm">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{label}</p>
          {helper ? <p className="truncate text-xs text-muted-foreground">{helper}</p> : null}
        </div>
        <Button size="lg" {...buttonProps}>
          {buttonProps?.children ?? price ?? "Continuar"}
        </Button>
      </div>
    </div>
  );
}

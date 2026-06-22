import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva(
  "inline-flex min-w-max items-center justify-center gap-2 whitespace-nowrap rounded-[12px] font-sans text-sm font-semibold transition-[transform,box-shadow,background-color,border-color] duration-[160ms] ease-out-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)] hover:-translate-y-[1px] hover:bg-[var(--brand-press)] hover:shadow-[var(--shadow-md)]",
        secondary:
          "bg-[var(--paper-sunken)] text-[var(--ink)] shadow-[var(--shadow-sm)] hover:-translate-y-[1px] hover:bg-[var(--crust-soft)] hover:shadow-[var(--shadow-md)]",
        outline:
          "border border-[var(--line-strong)] bg-[var(--paper-raised)] text-[var(--ink)] shadow-[var(--shadow-sm)] hover:-translate-y-[1px] hover:border-[var(--brand)] hover:text-[var(--brand)] hover:shadow-[var(--shadow-md)]",
        ghost:
          "text-[var(--ink)] hover:bg-[var(--paper-sunken)] hover:text-[var(--brand)]",
        accent:
          "bg-[var(--accent)] text-[var(--ink)] shadow-[var(--shadow-sm)] hover:-translate-y-[1px] hover:bg-[var(--accent-edge)] hover:shadow-[var(--shadow-md)]"
      },
      size: {
        default: "h-11 px-sm",
        sm: "h-9 px-xs",
        lg: "h-[52px] px-md text-base",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          aria-busy={loading || undefined}
          {...props}
        >
          {children}
        </Slot>
      );
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden
          />
        ) : null}
        <span className="inline-flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-w-max items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-base ease-out-soft focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.92]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-[var(--brand-hover)] hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-[var(--accent-edge)] hover:shadow-md",
        outline: "border border-border bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] text-foreground shadow-xs hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-card hover:shadow-sm",
        ghost: "text-foreground hover:bg-muted",
        accent: "bg-accent text-accent-foreground shadow-sm hover:-translate-y-0.5 hover:bg-[var(--accent-edge)] hover:shadow-md"
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

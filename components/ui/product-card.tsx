"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
type ProductCardProps = {
  href: string;
  imageUrl: string;
  name: string;
  category: string;
  price: number;
  availability?: string;
  onQuickAdd?: () => void;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  className?: string;
};
export function ProductCard({
  href,
  imageUrl,
  name,
  category,
  price,
  availability,
  onQuickAdd,
  quantity = 0,
  onIncrement,
  onDecrement,
  className
}: ProductCardProps) {
  function increment() {
    onIncrement?.();
    onQuickAdd?.();
  }
  function decrement() {
    onDecrement?.();
  }
  return (
    <article
      className={cn(
        "enter-rise group relative flex flex-col overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--paper-raised)] shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-[220ms] ease-out-soft hover:-translate-y-[3px] hover:border-[var(--brand-soft)] hover:shadow-[var(--shadow-md)]",
        className
      )}
    >
      <Link href={href} className="block focus-visible:outline-none">
        <div className="skeleton-shimmer relative aspect-[4/5] overflow-hidden bg-[var(--paper-sunken)]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 320px"
            className="object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full border border-[var(--brand)]/15 bg-[var(--paper-raised)]/90 px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-[var(--brand)] shadow-[var(--shadow-sm)] backdrop-blur-[10px]">
            {category}
          </span>
          {availability ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-2.5 py-1 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-[var(--ink)] shadow-[var(--shadow-sm)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" aria-hidden />
              {availability}
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={href} className="block focus-visible:outline-none">
          <h3 className="font-sans text-[1.0625rem] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--ink)] transition-colors duration-[160ms] group-hover:text-[var(--brand)]">
            {name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <p className="font-mono text-[1.1875rem] font-semibold tracking-[-0.01em] text-[var(--ink)] [font-variant-numeric:tabular-nums]">
            {formatCurrency(price)}
          </p>
          {quantity > 0 ? (
            <div className="grid h-10 w-[116px] grid-cols-[36px_1fr_36px] overflow-hidden rounded-full bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]">
              <button
                type="button"
                className="flex h-10 items-center justify-center transition-colors duration-[120ms] hover:bg-[var(--brand-press)] active:scale-[0.9]"
                onClick={decrement}
                aria-label="Quitar pieza"
              >
                <Minus className="h-4 w-4" aria-hidden />
              </button>
              <span className="flex h-10 items-center justify-center font-mono text-[0.9375rem] font-semibold [font-variant-numeric:tabular-nums]">
                {quantity}
              </span>
              <button
                type="button"
                className="flex h-10 items-center justify-center transition-colors duration-[120ms] hover:bg-[var(--brand-press)] active:scale-[0.9]"
                onClick={increment}
                aria-label="Agregar pieza"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : (
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 rounded-full shadow-[var(--shadow-sm)] transition-transform duration-[120ms] hover:scale-[1.06] active:scale-[0.9]"
              onClick={increment}
              aria-label={`Agregar ${name}`}
            >
              <Plus className="h-[18px] w-[18px]" aria-hidden />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUpItem } from "@/lib/motion";
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
    <motion.article
      variants={fadeUpItem}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -80px" }}
      className={cn("group overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] shadow-[var(--shadow-sm)] transition-all duration-base ease-out-soft hover:-translate-y-1 hover:shadow-[var(--shadow-md)]", className)}
    >
      <Link href={href} className="block">
        <div className="skeleton-shimmer relative aspect-[4/5] overflow-hidden bg-[var(--paper-sunken)]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 320px"
            className="object-cover transition-transform duration-base ease-out-soft group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-0 transition-opacity duration-base group-hover:opacity-100" />
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-white/50 bg-white/85 px-2.5 py-1 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-soft)] backdrop-blur-[8px]">{category}</span>
            {availability ? <span className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">{availability}</span> : null}
          </div>
          <h3 className="font-sans text-[1.0625rem] font-semibold leading-[1.25] text-[var(--ink)]">{name}</h3>
          <p className="font-mono text-[1.125rem] font-medium text-[var(--ink)] [font-variant-numeric:tabular-nums]">{formatCurrency(price)}</p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        {quantity > 0 ? (
          <motion.div layout className="ml-auto grid h-10 w-28 grid-cols-[32px_1fr_32px] overflow-hidden rounded-full bg-[var(--brand-tint)] text-[var(--brand)]">
            <button type="button" className="flex h-10 items-center justify-center active:scale-[0.92]" onClick={decrement} aria-label="Quitar pieza">
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <span className="flex h-10 items-center justify-center font-mono text-sm font-medium [font-variant-numeric:tabular-nums]">{quantity}</span>
            <button type="button" className="flex h-10 items-center justify-center active:scale-[0.92]" onClick={increment} aria-label="Agregar pieza">
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="flex justify-end">
            <Button type="button" size="icon" className="rounded-full active:scale-[0.92]" onClick={increment} aria-label={`Agregar ${name}`}>
              <Plus className="h-4 w-4" aria-hidden />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}

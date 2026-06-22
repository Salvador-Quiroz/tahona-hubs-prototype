"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      className={cn("group overflow-hidden rounded-lg border border-border bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] shadow-sm transition-all duration-base ease-out-soft hover:-translate-y-1 hover:shadow-md", className)}
    >
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 320px"
            className="object-cover transition-transform duration-base ease-out-soft group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-0 transition-opacity duration-base group-hover:opacity-100" />
        </div>
        <div className="space-y-3 p-md">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline">{category}</Badge>
            {availability ? <span className="text-caption font-semibold uppercase text-muted-foreground">{availability}</span> : null}
          </div>
          <h3 className="font-display text-2xl font-semibold leading-tight text-foreground">{name}</h3>
          <p className="font-mono text-2xl font-semibold text-foreground">{formatCurrency(price)}</p>
        </div>
      </Link>
      <div className="px-md pb-md">
        {quantity > 0 ? (
          <motion.div layout className="ml-auto grid h-11 w-[120px] grid-cols-[44px_1fr_44px] overflow-hidden rounded-md border border-[color-mix(in_srgb,var(--brand)_25%,transparent)] bg-info-bg shadow-xs">
            <button type="button" className="flex h-11 items-center justify-center text-primary active:scale-[0.92]" onClick={decrement} aria-label="Quitar pieza">
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <span className="flex h-11 items-center justify-center font-mono text-sm font-semibold text-primary">{quantity}</span>
            <button type="button" className="flex h-11 items-center justify-center bg-primary text-white active:scale-[0.92]" onClick={increment} aria-label="Agregar pieza">
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

"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: number | string;
  formatter?: (value: number) => string;
  helper?: string;
  target?: string;
  delta?: string;
  deltaTone?: "up" | "down" | "flat";
  icon?: LucideIcon;
  className?: string;
};

export function KpiCard({
  label,
  value,
  formatter,
  helper,
  target,
  delta,
  deltaTone = "flat",
  icon: Icon,
  className
}: KpiCardProps) {
  const numeric = typeof value === "number";
  const [displayValue, setDisplayValue] = useState<number | string>(value);
  const previousNumericValue = useRef(numeric ? Number(value) : 0);
  const DeltaIcon = deltaTone === "up" ? ArrowUpRight : deltaTone === "down" ? ArrowDownRight : Minus;

  useEffect(() => {
    if (!numeric) {
      setDisplayValue(value);
      return;
    }
    const endValue = Number(value);
    const startValue = previousNumericValue.current;
    previousNumericValue.current = endValue;
    const controls = animate(startValue, endValue, {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(latest)
    });
    return () => controls.stop();
  }, [numeric, value]);

  const renderedValue = numeric
    ? formatter
      ? formatter(Number(displayValue))
      : formatNumber(Math.round(Number(displayValue)))
    : displayValue;

  return (
    <article className={cn("relative overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)] backdrop-blur transition-all duration-base ease-out-soft hover:-translate-y-1 hover:shadow-[var(--shadow-md)]", className)}>
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-40" aria-hidden />
      <div className="flex items-start justify-between gap-md">
        <div>
          <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">{label}</p>
          <p className="mt-3 font-mono text-3xl font-medium leading-none text-[var(--ink)] [font-variant-numeric:tabular-nums]">{renderedValue}</p>
        </div>
        {Icon ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--brand-tint)] text-[var(--brand)] shadow-[var(--shadow-sm)]">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        ) : null}
      </div>
      <div className="mt-md flex flex-wrap items-center gap-xs text-sm">
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-semibold",
              deltaTone === "up" && "text-[var(--ok)]",
              deltaTone === "down" && "text-[var(--danger)]",
              deltaTone === "flat" && "text-[var(--ink-faint)]"
            )}
          >
            <DeltaIcon className="h-4 w-4" aria-hidden />
            {delta}
          </span>
        ) : null}
        {target ? <span className="text-[var(--ink-faint)]">Target: {target}</span> : null}
      </div>
      {helper ? <p className="mt-2 font-sans text-sm leading-5 text-[var(--ink-soft)]">{helper}</p> : null}
    </article>
  );
}

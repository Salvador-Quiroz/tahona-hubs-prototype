import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("es-MX").format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "percent",
    maximumFractionDigits: 1
  }).format(value);
}

export function shortDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type BottomTabItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
};

type BottomTabBarProps = {
  items: BottomTabItem[];
  className?: string;
};

export function BottomTabBar({ items, className }: BottomTabBarProps) {
  const pathname = usePathname();
  const visibleItems = items.slice(0, 5);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden",
        className
      )}
      aria-label="Navegacion principal"
    >
      <div className="grid min-h-16" style={{ gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))` }}>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 px-2 text-xs font-semibold transition-colors duration-fast",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-[25px] w-[25px]" aria-hidden />
              <span className="relative">
                {item.label}
                {item.badge ? (
                  <span className="absolute -right-4 -top-7 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 font-mono text-[10px] font-semibold text-secondary-foreground">
                    {item.badge}
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

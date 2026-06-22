"use client";

import { MapPin } from "lucide-react";
import type { Hub } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type HubMapProps = {
  hubs: Hub[];
  activeHubId?: string;
  compact?: boolean;
};

const positions: Record<string, { left: string; top: string }> = {
  "hub-polanco": { left: "34%", top: "30%" },
  "hub-condesa": { left: "47%", top: "58%" },
  "hub-del-valle": { left: "60%", top: "76%" }
};

export function HubMap({ hubs, activeHubId, compact = false }: HubMapProps) {
  return (
    <div
      className={cn(
        "brand-blueprint relative overflow-hidden rounded-lg border border-white/25 text-white shadow-editorial",
        compact ? "h-56" : "h-[360px]"
      )}
      aria-label="Mapa estilizado de hubs Tahona en CDMX"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_50%,rgba(255,207,90,0.18),transparent_34%)]" />
      <div className="absolute left-1/4 top-0 h-full w-1 rotate-[28deg] bg-white/35" />
      <div className="absolute left-1/2 top-0 h-full w-1 -rotate-[18deg] bg-white/28" />
      <div className="absolute left-0 top-1/2 h-1 w-full rotate-[8deg] bg-white/32" />
      <div className="absolute bottom-6 left-6 rounded-full border border-white/30 bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
        CDMX red inicial
      </div>
      {hubs.map((hub) => {
        const pos = positions[hub.id];
        const active = !activeHubId || activeHubId === hub.id;
        return (
          <div
            key={hub.id}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 transition-all",
              active ? "scale-100 opacity-100" : "scale-90 opacity-45"
            )}
            style={{ left: pos.left, top: pos.top }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tahona-yellow text-tahona-ink shadow-lift ring-4 ring-white/20">
                <MapPin className="h-5 w-5" aria-hidden />
              </div>
              <div className="whitespace-nowrap rounded-md bg-white px-3 py-1 text-xs font-bold text-tahona-ink shadow-soft">
                {hub.nombre}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

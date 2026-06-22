"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  getRowId: (row: T) => string;
  selectable?: boolean;
  bulkActions?: ReactNode;
  emptyState?: ReactNode;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectable = false,
  bulkActions,
  emptyState,
  className
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const ids = useMemo(() => rows.map(getRowId), [rows, getRowId]);
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(ids));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (rows.length === 0) {
    return (
      <div className={cn("rounded-lg border border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-md shadow-sm", className)}>
        {emptyState ?? <p className="text-sm text-muted-foreground">Sin datos para mostrar.</p>}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg border border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] shadow-sm backdrop-blur", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-surface-2/90 text-caption uppercase text-muted-foreground backdrop-blur">
            <tr className="border-b border-border">
              {selectable ? (
                <th className="w-11 px-xs text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Seleccionar todos"
                    className="h-4 w-4 accent-primary"
                  />
                </th>
              ) : null}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "h-11 px-sm font-semibold",
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center",
                    (!column.align || column.align === "left") && "text-left"
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const id = getRowId(row);
              return (
                <tr key={id} className={cn("h-11 border-b border-border transition-colors hover:bg-info-bg last:border-0", index % 2 === 1 && "bg-[color-mix(in_srgb,var(--surface-2)_55%,transparent)]")}>
                  {selectable ? (
                    <td className="px-xs">
                      <input
                        type="checkbox"
                        checked={selected.has(id)}
                        onChange={() => toggleOne(id)}
                        aria-label={`Seleccionar fila ${id}`}
                        className="h-4 w-4 accent-primary"
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-sm py-2 align-middle",
                        column.align === "right" && "text-right font-mono tabular-nums",
                        column.align === "center" && "text-center"
                      )}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectable && selected.size > 0 ? (
        <div className="absolute inset-x-md bottom-md flex items-center justify-between rounded-lg border border-border bg-card p-xs shadow-md">
          <span className="px-xs text-sm font-semibold">{selected.size} seleccionados</span>
          <div className="flex items-center gap-xs">{bulkActions}</div>
        </div>
      ) : null}
    </div>
  );
}

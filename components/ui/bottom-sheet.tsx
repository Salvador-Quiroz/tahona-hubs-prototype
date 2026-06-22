"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sheetVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

type BottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className
}: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                variants={sheetVariants}
                initial="closed"
                animate="open"
                exit="closed"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 120) onOpenChange(false);
                }}
                className={cn(
                  "fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-xl border border-border bg-card p-md pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-lg lg:hidden",
                  className
                )}
              >
                <div className="mx-auto mb-sm h-1 w-12 rounded-full bg-[var(--border-strong)]" aria-hidden />
                <div className="flex items-start justify-between gap-md">
                  <div>
                    <Dialog.Title className="text-h2 font-semibold">{title}</Dialog.Title>
                    {description ? (
                      <Dialog.Description className="mt-2 text-body-s text-muted-foreground">
                        {description}
                      </Dialog.Description>
                    ) : null}
                  </div>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon" aria-label="Cerrar">
                      <X className="h-5 w-5" aria-hidden />
                    </Button>
                  </Dialog.Close>
                </div>
                <div className="mt-md">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

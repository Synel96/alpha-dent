import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

type ServiceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: string[];
};

export function ServiceModal({ open, onOpenChange, title, items }: ServiceModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-brand-border bg-brand-black p-0 text-brand-gold shadow-2xl outline-none">
          <div className="border-b border-brand-border px-5 py-4 pr-12">
            <Dialog.Title className="text-lg font-semibold text-brand-gold-light">
              {title}
            </Dialog.Title>
          </div>

          <div className="max-h-[65vh] overflow-auto px-5 py-4">
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-brand-border/70 bg-brand-surface/55 px-3 py-2 text-sm leading-relaxed text-brand-gold-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Dialog.Close
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-gold-muted transition-colors hover:bg-brand-surface hover:text-brand-gold"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

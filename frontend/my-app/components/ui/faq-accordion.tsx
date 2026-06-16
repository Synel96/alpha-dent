import React from "react";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
  defaultOpenIndex?: number;
};

export function FaqAccordion({
  items,
  className,
  defaultOpenIndex = 0,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number>(defaultOpenIndex);
  const [visible, setVisible] = React.useState(false);
  const rootRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={rootRef} className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <article
            key={item.question}
            style={{ transitionDelay: `${index * 55}ms` }}
            className={cn(
              "overflow-hidden rounded-2xl border border-brand-border bg-[linear-gradient(120deg,rgba(17,17,20,0.96),rgba(17,17,20,0.72))]",
              "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : index)}
              className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-surface/50"
              aria-expanded={open}
              aria-controls={`faq-panel-${index}`}
            >
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-black/40 text-xs font-semibold text-brand-gold-light">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 pr-2 text-sm font-medium leading-relaxed text-brand-gold-light md:text-base">
                {item.question}
              </span>
              <span
                className={`text-brand-gold-muted transition-transform duration-300 ${
                  open ? "rotate-45" : "rotate-0"
                }`}
                aria-hidden
              >
                +
              </span>
            </button>

            <div
              id={`faq-panel-${index}`}
              className={`grid transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-16 pb-5 text-sm leading-relaxed text-brand-gold-muted">
                  {item.answer}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

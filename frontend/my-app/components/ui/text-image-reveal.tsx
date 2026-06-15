import React from "react";
import { cn } from "@/lib/utils";

type TextImageRevealProps = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  eyebrow?: string;
  reverse?: boolean;
  className?: string;
  contentClassName?: string;
  imageClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageSizes?: string;
  imageLoading?: "eager" | "lazy";
  imageDecoding?: "async" | "sync" | "auto";
  delayMs?: number;
  children?: React.ReactNode;
};

export function TextImageReveal({
  title,
  description,
  imageSrc,
  imageAlt,
  eyebrow,
  reverse = false,
  className,
  contentClassName,
  imageClassName,
  imageWidth = 960,
  imageHeight = 640,
  imageSizes = "(max-width: 768px) 100vw, 50vw",
  imageLoading = "lazy",
  imageDecoding = "async",
  delayMs = 0,
  children,
}: TextImageRevealProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

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
        threshold: 0.22,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className={cn(
        "grid items-center gap-8 md:grid-cols-2 md:gap-12",
        reverse ? "md:[&>*:first-child]:order-2" : "",
        className
      )}
    >
      <div
        style={{ transitionDelay: `${delayMs}ms` }}
        className={cn(
          "space-y-4 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          contentClassName
        )}
      >
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="text-2xl font-semibold leading-tight text-brand-gold-light md:text-3xl">
          {title}
        </h2>

        <p className="max-w-prose text-sm leading-relaxed text-brand-gold-muted md:text-base">
          {description}
        </p>

        {children ? <div className="pt-2">{children}</div> : null}
      </div>

      <div
        style={{ transitionDelay: `${delayMs + 90}ms` }}
        className={cn(
          "overflow-hidden rounded-2xl border border-brand-border bg-brand-surface/70 shadow-[0_18px_36px_-24px_rgba(201,168,76,0.45)]",
          "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
          visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          imageClassName
        )}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt ?? ""}
            width={imageWidth}
            height={imageHeight}
            loading={imageLoading}
            decoding={imageDecoding}
            sizes={imageSizes}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="relative flex min-h-[280px] items-center justify-center bg-[radial-gradient(circle_at_25%_20%,rgba(228,196,106,0.2),transparent_55%),linear-gradient(135deg,#111114,#08080a)]">
            <div className="rounded-xl border border-dashed border-brand-gold/45 bg-brand-black/45 px-6 py-5 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-gold-muted">
                Kep helye
              </p>
              <p className="mt-2 text-sm text-brand-gold-light">Ide kerul majd a vegleges foto</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

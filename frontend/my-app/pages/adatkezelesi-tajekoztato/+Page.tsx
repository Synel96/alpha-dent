import React from "react";
import { usePageContext } from "vike-react/usePageContext";
import { PageContainer } from "../../components/ui/page-container";
import { PRIVACY_POLICY_EFFECTIVE_DATE } from "../../lib/clinic-info";
import { privacyPolicy, type FactRow, type PrivacyBlock } from "../../lib/privacy-policy";

export { Page };

const LINKABLE = /(https?:\/\/[^\s),]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

// Turns the e-mail addresses and URLs inside a plain-text paragraph into links.
function Linkified({ text }: { text: string }) {
  const parts = text.split(LINKABLE);
  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 0) return part;
        // A sentence-ending full stop isn't part of the address.
        const trailing = part.endsWith(".") ? "." : "";
        const target = trailing ? part.slice(0, -1) : part;
        const href = target.includes("@") && !target.startsWith("http") ? `mailto:${target}` : target;
        return (
          <React.Fragment key={index}>
            <a
              href={href}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              className="break-words text-brand-gold-light underline-offset-4 hover:underline"
            >
              {target}
            </a>
            {trailing}
          </React.Fragment>
        );
      })}
    </>
  );
}

function Facts({ rows }: { rows: FactRow[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-2 rounded-xl border border-brand-gold/25 bg-brand-surface/55 p-4 text-sm sm:grid-cols-[minmax(10rem,auto)_1fr] md:p-5">
      {rows.map((row) => (
        <React.Fragment key={row.label}>
          <dt className="text-brand-gold-muted">{row.label}</dt>
          <dd className="mb-2 text-white sm:mb-0">
            <Linkified text={row.value} />
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

function Block({ block }: { block: PrivacyBlock }) {
  switch (block.kind) {
    case "p":
      return (
        <p className="text-sm leading-relaxed text-white/90 md:text-base">
          <Linkified text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="space-y-2 text-sm leading-relaxed text-white/90 md:text-base">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-gold" />
              <span>
                <Linkified text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "facts":
      return <Facts rows={block.rows} />;
    case "processing":
      return (
        <div className="space-y-4">
          {block.items.map((item) => (
            <article key={item.title} className="rounded-xl border border-brand-gold/25 bg-brand-surface/55 p-4 md:p-5">
              <h3 className="mb-3 text-base font-semibold text-brand-gold-light">{item.title}</h3>
              <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[minmax(9rem,auto)_1fr]">
                {item.rows.map((row) => (
                  <React.Fragment key={row.label}>
                    <dt className="text-brand-gold-muted">{row.label}</dt>
                    <dd className="mb-2 leading-relaxed text-white sm:mb-0">
                      <Linkified text={row.value} />
                    </dd>
                  </React.Fragment>
                ))}
              </dl>
            </article>
          ))}
        </div>
      );
  }
}

function Page() {
  const { locale } = usePageContext();
  const policy = privacyPolicy(locale);
  // Fixed to UTC so the prerendered date and the hydrated one always agree.
  const effectiveDate = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${PRIVACY_POLICY_EFFECTIVE_DATE}T00:00:00Z`)
  );

  return (
    <PageContainer className="py-10 md:py-14">
      <article className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-4">
          <h1 className="text-2xl font-semibold text-brand-gold-light md:text-4xl">{policy.title}</h1>
          <p className="text-xs uppercase tracking-[0.22em] text-brand-gold-muted">
            {policy.effectiveLabel}: <time dateTime={PRIVACY_POLICY_EFFECTIVE_DATE}>{effectiveDate}</time>
          </p>
          {policy.hungarianPrevails ? (
            <p className="text-sm italic text-brand-gold-muted">{policy.hungarianPrevails}</p>
          ) : null}
          <p className="text-sm leading-relaxed text-white/90 md:text-base">
            <Linkified text={policy.intro} />
          </p>
        </header>

        <nav
          aria-label={policy.tocTitle}
          className="rounded-xl border border-brand-gold/25 bg-brand-surface/40 p-4 md:p-5"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-brand-gold-muted">{policy.tocTitle}</p>
          <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
            {policy.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-white/85 transition-colors hover:text-brand-gold-light">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {policy.sections.map((section) => (
          // scroll-mt: the fixed navbar mustn't cover the heading after a TOC jump.
          <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
            <h2 className="text-lg font-semibold text-brand-gold-light md:text-2xl">{section.title}</h2>
            {section.blocks.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </section>
        ))}
      </article>
    </PageContainer>
  );
}

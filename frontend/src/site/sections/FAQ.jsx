import { useState } from "react";
import { Plus, Phone, Mail } from "lucide-react";
import { FAQS, BUSINESS } from "../config";

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative bg-cream py-24 lg:py-32">
      <div aria-hidden="true" className="dot-grid absolute right-10 top-20 hidden h-40 w-40 opacity-50 lg:block" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
        {/* ── Intro ─ */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-brand" data-reveal>
            <span aria-hidden="true" className="h-[2px] w-7 rounded-full bg-brand" /> FAQ
          </p>
          <h2
            className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-navy sm:text-4xl lg:text-[2.8rem]"
            data-reveal
          >
            Questions, <span className="text-brand">Answered.</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-navy/60" data-reveal>
            Everything you might want to know about the app, the shops and how we deliver.
          </p>

          <div className="mt-8 max-w-md rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy/5" data-reveal>
            <p className="font-display text-base font-bold text-navy">Still curious?</p>
            <p className="mt-1 text-sm text-navy/60">Talk to a real person from Bagaha.</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex items-center gap-2.5 text-sm font-bold text-brand transition-colors hover:text-accent"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                {BUSINESS.phone}
              </a>
              <a
                href={BUSINESS.emailHref}
                className="inline-flex items-center gap-2.5 break-all text-sm font-medium text-navy/70 transition-colors hover:text-brand"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cream text-brand">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                {BUSINESS.email}
              </a>
            </div>
          </div>
        </div>

        {/* ── Accordion ─ */}
        <div className="flex flex-col gap-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`overflow-hidden rounded-2xl bg-white shadow-soft ring-1 transition-all duration-300 ${
                  isOpen ? "ring-brand/30" : "ring-navy/5 hover:ring-navy/15"
                }`}
                data-reveal
                data-delay={i * 0.05}
              >
                <h3>
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  >
                    <span className="font-display text-base font-bold tracking-tight text-navy sm:text-lg">
                      {f.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                        isOpen ? "rotate-45 bg-gradient-to-br from-brand to-accent text-white shadow-glow" : "bg-cream text-navy"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className="acc-panel"
                  data-open={isOpen}
                >
                  <div>
                    <p className="px-6 pb-6 text-sm leading-relaxed text-navy/65">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
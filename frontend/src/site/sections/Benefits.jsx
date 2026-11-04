import { MapPin, Store, Sparkles, Bike, ArrowRight } from "lucide-react";
import { BENEFITS } from "../config";

const ICONS = { MapPin, Store, Sparkles, Bike };

export default function Benefits() {
  return (
    <section id="why" className="relative overflow-hidden bg-navy py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(50% 60% at 12% 0%, rgba(244,115,66,0.18), transparent 60%), radial-gradient(40% 50% at 95% 100%, rgba(242,87,43,0.12), transparent 60%)",
        }}
      />
      <div aria-hidden="true" className="dot-grid-light absolute right-10 top-12 hidden h-40 w-40 opacity-40 lg:block" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div data-reveal>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-brand">
              <span aria-hidden="true" className="h-[2px] w-7 rounded-full bg-brand" /> The Mishra Ji way
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.8rem]">
              Rooted in Bagaha. <span className="text-brand">Made for Your Cravings.</span>
            </h2>
          </div>
          <a
            href="#download"
            className="group inline-flex items-center gap-2 font-display text-sm font-bold text-brand transition-colors hover:text-white"
            data-reveal
          >
            Get the app
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-14 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {BENEFITS.map((b, i) => {
            const Icon = ICONS[b.icon];
            return (
              <div
                key={b.title}
                className="group flex gap-5 border-t border-white/10 pt-8"
                data-reveal
                data-delay={i * 0.08}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-brand transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-brand group-hover:to-accent group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-white">
                    <span className="mr-2 text-sm font-extrabold text-brand/70">0{i + 1}</span>
                    {b.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">{b.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
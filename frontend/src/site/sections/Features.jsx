import { Search, Store, Smartphone, Bike, MapPin, ArrowUpRight } from "lucide-react";
import { FEATURES } from "../config";

const ICONS = { Search, Store, Smartphone, Bike, MapPin };

export default function Features() {
  const wide = FEATURES.find((f) => f.span === "wide");
  const tall = FEATURES.find((f) => f.span === "tall");
  const std = FEATURES.filter((f) => f.span === "std");

  return (
    <section id="features" className="relative overflow-hidden bg-cream py-24 lg:py-32">
      <span
        aria-hidden="true"
        className="text-outline-navy absolute -top-3 left-4 hidden select-none font-display text-[7.5rem] font-extrabold leading-none xl:block"
      >
        FEATURES
      </span>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div data-reveal>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-brand">
              <span aria-hidden="true" className="h-[2px] w-7 rounded-full bg-brand" /> App features
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-navy sm:text-4xl lg:text-[2.8rem]">
              Everything You Crave, <span className="text-brand">One App Away.</span>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-navy/60" data-reveal>
            From discovering local favourites to doorstep delivery — here's what the Mishra Ji app
            puts in your pocket.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-6">
          {/* ── Wide card: discover ── */}
          <article
            className="group relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift md:col-span-4 sm:p-8"
            data-reveal
          >
            <div className="flex h-full flex-col items-start gap-8 sm:flex-row sm:items-center">
              <div className="max-w-xs flex-1">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-accent text-white shadow-glow">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-navy">{wide.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-navy/60">{wide.text}</p>
              </div>
              <div className="flex flex-1 items-center justify-center gap-3 self-stretch" aria-hidden="true">
                {wide.photos.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    className={`w-1/3 max-w-[120px] rounded-2xl object-cover shadow-soft transition-transform duration-500 group-hover:rotate-0 ${
                      i === 0 ? "h-32 -rotate-6 sm:h-40" : i === 1 ? "h-40 sm:h-52" : "h-32 rotate-6 sm:h-40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </article>

          {/* ── Tall photo card: partner shops ── */}
          <article
            className="group relative min-h-[320px] overflow-hidden rounded-3xl shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift md:col-span-2"
            data-reveal
            data-delay="0.1"
          >
            <img
              src={tall.photo}
              alt="Traditional Indian sweet shop counter"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-navy/10" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                <Store className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-white">{tall.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{tall.text}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Prakash Sweets · Railway Dhala
              </p>
            </div>
          </article>

          {/* ── Standard cards ── */}
          {std.map((f, i) => {
            const Icon = ICONS[f.icon];
            const Watermark = Icon;
            return (
              <article
                key={f.id}
                className="group relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift md:col-span-2"
                data-reveal
                data-delay={i * 0.08}
              >
                <Watermark
                  aria-hidden="true"
                  className="absolute -bottom-6 -right-6 h-28 w-28 rotate-12 text-brand/10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                />
                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute right-6 top-6 h-5 w-5 -translate-x-1 translate-y-1 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                />
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-accent transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-brand group-hover:to-accent group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-navy">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">{f.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
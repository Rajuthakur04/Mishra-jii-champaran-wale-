import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Store, MapPin, BadgeCheck, ArrowRight, UtensilsCrossed } from "lucide-react";
import { BUSINESS, IMAGES } from "../config";
import { getPublicShopsApi } from "../../admin/services/api";

gsap.registerPlugin(ScrollTrigger);

export default function Partner() {
  const ref = useRef(null);
  const [dynamicShops, setDynamicShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await getPublicShopsApi({ limit: 4 });
        if (res.data?.success && res.data.shops.length > 0) {
          setDynamicShops(res.data.shops);
        }
      } catch (err) {
        // Fallback to static config if offline
      }
    };
    fetchShops();
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".partner-photo",
        { clipPath: "inset(0 0 100% 0 round 40px)" },
        {
          clipPath: "inset(0 0 0% 0 round 40px)",
          duration: 1.3,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 65%", once: true },
        }
      );
      gsap.from(".partner-photo img", {
        scale: 1.25,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 65%", once: true },
      });
      gsap.from(".partner-polaroid", {
        y: 60,
        rotate: 18,
        autoAlpha: 0,
        duration: 1,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ref.current, start: "top 55%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="partners" ref={ref} className="relative overflow-hidden bg-cream py-24 lg:py-32">
      <div id="shops" className="sr-only" aria-hidden="true" />
      <div aria-hidden="true" className="dot-grid absolute left-8 top-16 hidden h-40 w-40 opacity-50 lg:block" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
        {/* ── Copy ─ */}
        <div>
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-brand" data-reveal>
            <span aria-hidden="true" className="h-[2px] w-7 rounded-full bg-brand" /> Local partners
          </p>
          <h2
            className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-navy sm:text-4xl lg:text-[2.8rem]"
            data-reveal
          >
            Connecting You With Your <span className="text-brand">Favourite Local Shops.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-navy/70 sm:text-lg" data-reveal>
            Mishra Ji Champaran Wale helps you access products from trusted local shops through one
            convenient platform. We source your favourites directly from partner shops and
            deliver them to your doorstep — the shops you know, now on your phone.
          </p>

          {/* Partner card or dynamic shops */}
          {dynamicShops.length > 0 ? (
            <div className="mt-8 space-y-4 max-w-xl" data-reveal>
              {dynamicShops.slice(0, 2).map((shop) => (
                <Link
                  key={shop._id}
                  to={`/shops/${shop.slug}`}
                  className="group flex items-start gap-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#320104] p-1 ring-1 ring-amber-400/40 flex items-center justify-center shrink-0 overflow-hidden">
                    {shop.logo ? (
                      <img src={shop.logo} alt={shop.name} className="w-full h-full object-contain" />
                    ) : (
                      <Store className="w-6 h-6 text-brand" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                        {shop.category}
                      </span>
                      <span className="text-xs font-bold text-brand flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Shop <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-navy group-hover:text-brand transition-colors mt-0.5 truncate">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-navy/60 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3 h-3 text-brand shrink-0" />
                      <span>{shop.address}, {shop.city}</span>
                    </p>
                  </div>
                </Link>
              ))}

              <Link
                to="/shops"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand hover:text-accent pt-2"
              >
                <span>View all partner shops in Bagaha</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div
              className="mt-9 flex max-w-xl items-start gap-5 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-7"
              data-reveal
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-accent text-white shadow-glow">
                <Store className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Featured partner
                </p>
                <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight text-navy">
                  {BUSINESS.partner.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-navy/60">
                  <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                  {BUSINESS.partner.location}
                </p>
                <p className="mt-3 border-t border-navy/5 pt-3 text-[13px] leading-relaxed text-navy/55">
                  Sweets and desserts sourced directly from their counter — discover them in the app.
                </p>
                <Link
                  to="/shops"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand"
                >
                  <span>Explore all local shops</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Visual ─ */}
        <div className="relative" data-reveal>
          <div aria-hidden="true" className="absolute -bottom-6 -left-6 h-full w-full rounded-[2.5rem] bg-brand/10" />
          <figure className="partner-photo relative overflow-hidden rounded-[2.5rem] shadow-lift">
            <img
              src={IMAGES.shopDisplayWide}
              alt="A traditional Indian sweet shop counter filled with mithai"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
            <figcaption className="absolute bottom-4 left-5 rounded-full bg-navy/55 px-4 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
              Representative image · traditional mithai counter
            </figcaption>
          </figure>

          <Link
            to="/shops"
            className="animate-float absolute -top-5 left-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand to-accent px-5 py-2.5 font-display text-sm font-bold text-white shadow-glow hover:opacity-95 transition"
          >
            <Store className="h-4 w-4" aria-hidden="true" /> Explore Partner Shops
          </Link>

          <img
            src={IMAGES.kajuKatli}
            alt="Kaju Katli garnished for serving"
            loading="lazy"
            className="partner-polaroid absolute -bottom-10 -right-3 hidden w-36 rotate-6 rounded-2xl border-4 border-white object-cover shadow-lift sm:block lg:-right-8 lg:w-44"
          />
        </div>
      </div>
    </section>
  );
}
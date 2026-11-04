import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Candy, IceCreamCone, Store, Bike, ArrowDown } from "lucide-react";
import PhoneMockup from "../components/PhoneMockup";
import { SCREENS } from "../config";

gsap.registerPlugin(ScrollTrigger);

const POINTS = [
  {
    icon: Candy,
    title: "Discover local sweets",
    text: "Pedha, rasgulla, laddu and more from Bagaha's own sweet shops.",
  },
  {
    icon: IceCreamCone,
    title: "Explore ice creams",
    text: "Ice creams and kulfi for every kind of sweet craving.",
  },
  {
    icon: Store,
    title: "Partner shop products",
    text: "Sourced from trusted shops like Prakash Sweets.",
  },
  {
    icon: Bike,
    title: "Doorstep delivery",
    text: "Order in the app and we bring it to your home.",
  },
];

export default function About() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".about-phone", {
        y: 90,
        rotate: -12,
        autoAlpha: 0,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
      });
      gsap.from(".about-chip", {
        scale: 0,
        autoAlpha: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: ref.current, start: "top 60%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
        {/* ── Visual ─ */}
        <div className="relative order-2 lg:order-1" data-reveal>
          <div className="relative rounded-[3rem] bg-cream px-8 py-12 sm:px-14 sm:py-16">
            <div aria-hidden="true" className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-brand/10" />
            <div aria-hidden="true" className="dot-grid absolute bottom-8 right-8 h-32 w-32 opacity-60" />
            <div
              aria-hidden="true"
              className="absolute right-10 top-10 h-20 w-20 rounded-full border-2 border-dashed border-brand/30"
            />
            <div className="about-phone mx-auto w-60 sm:w-72">
              <div className="[transform:rotate(-4deg)]">
                <PhoneMockup screen={SCREENS.shops} />
              </div>
            </div>

            <div className="about-chip absolute -right-3 top-14 sm:right-6">
              <div className="animate-float flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-lift ring-1 ring-navy/5">
                <IceCreamCone className="h-5 w-5 text-accent" aria-hidden="true" />
                <span className="font-display text-sm font-bold text-navy">Ice Cream &amp; Kulfi</span>
              </div>
            </div>
            <div className="about-chip absolute -left-3 bottom-16 sm:left-4">
              <div className="animate-float-slow flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-lift ring-1 ring-navy/5" style={{ animationDelay: "1.2s" }}>
                <Candy className="h-5 w-5 text-brand" aria-hidden="true" />
                <span className="font-display text-sm font-bold text-navy">Sweets &amp; Namkeen</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Copy ── */}
        <div className="order-1 lg:order-2">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-brand" data-reveal>
            <span aria-hidden="true" className="h-[2px] w-7 rounded-full bg-brand" /> About the app
          </p>
          <h2
            className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-navy sm:text-4xl lg:text-[2.8rem]"
            data-reveal
          >
            Discover the Taste of Your{" "}
            <span className="text-brand">Favourite Local Shops.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-navy/70 sm:text-lg" data-reveal>
            Mishra Ji Champaran Wale brings your favourite local sweets, ice creams and snacks closer
            to you through one convenient mobile application.
          </p>

          <div className="mt-9 grid gap-6 sm:grid-cols-2">
            {POINTS.map((p, i) => (
              <div key={p.title} className="flex gap-3.5" data-reveal data-delay={i * 0.08}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-accent">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-[15px] font-bold text-navy">{p.title}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-navy/60">{p.text}</span>
                </span>
              </div>
            ))}
          </div>

          <a
            href="#how-it-works"
            className="group mt-10 inline-flex items-center gap-2 font-display text-sm font-bold text-brand transition-colors hover:text-accent"
            data-reveal
          >
            See how it works
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
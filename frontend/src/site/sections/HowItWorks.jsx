import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Smartphone, Search, Store, ShoppingBag, Bike } from "lucide-react";
import PhoneMockup from "../components/PhoneMockup";
import { STEPS, SCREENS } from "../config";

gsap.registerPlugin(ScrollTrigger);

const ICONS = { Smartphone, Search, Store, ShoppingBag, Bike };

export default function HowItWorks() {
  const ref = useRef(null);
  const stepsContainerRef = useRef(null);
  const phoneWrapperRef = useRef(null);
  const screenRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [motionOk] = useState(
    () => typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        // Step active triggers
        STEPS.forEach((_, i) => {
          ScrollTrigger.create({
            trigger: `.hiw-step-${i}`,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          });
        });

        // Vertical step progress line
        gsap.fromTo(
          ".hiw-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: { trigger: ".hiw-steps", start: "top 55%", end: "bottom 55%", scrub: 0.3 },
          }
        );

        // Explicit GSAP Pinning for Phone Mockup (ensures rock-solid stickiness across all browsers)
        if (phoneWrapperRef.current && stepsContainerRef.current) {
          ScrollTrigger.create({
            trigger: stepsContainerRef.current,
            pin: phoneWrapperRef.current,
            start: "top 100px",
            end: "bottom bottom",
            pinSpacing: false,
            anticipatePin: 1,
          });
        }
      });
    }, ref);
    return () => ctx.revert();
  }, [motionOk]);

  /* crossfade the sticky phone screens */
  useEffect(() => {
    screenRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        autoAlpha: i === active ? 1 : 0,
        scale: i === active ? 1 : 1.05,
        duration: motionOk ? 0.55 : 0,
        ease: "power2.out",
      });
    });
  }, [active, motionOk]);

  return (
    <section id="how-it-works" ref={ref} className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <p className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-brand">
            <span aria-hidden="true" className="h-[2px] w-7 rounded-full bg-brand" />
            How it works
            <span aria-hidden="true" className="h-[2px] w-7 rounded-full bg-brand" />
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-navy sm:text-4xl lg:text-[2.8rem]">
            Your Favourite Treats, Just a <span className="text-brand">Few Steps Away.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-navy/60">
            The whole journey happens inside the Mishra Ji app — this page simply shows you the way.
          </p>
        </div>

        <div ref={stepsContainerRef} className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20 items-start relative">
          {/* ── Sticky phone (desktop) ── */}
          <div className="relative hidden lg:block h-full min-h-[500px]">
            <div
              ref={phoneWrapperRef}
              className="sticky top-28 xl:top-32 flex flex-col items-center pb-10 w-full will-change-transform"
            >
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="animate-spin-slow absolute left-1/2 top-1/2 aspect-square h-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-brand/20"
                />
                <div className="relative w-[280px] xl:w-[300px]">
                  {STEPS.map((s, i) => (
                    <div
                      key={s.title}
                      ref={(el) => (screenRefs.current[i] = el)}
                      className={i === 0 ? "relative" : "absolute inset-0"}
                      style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
                    >
                      <PhoneMockup screen={SCREENS[s.screen]} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <span className="font-display text-3xl font-extrabold tracking-tight text-navy">
                  0{active + 1}
                  <span className="text-base font-bold text-navy/35"> / 05</span>
                </span>
                <span className="h-8 w-px bg-navy/10" aria-hidden="true" />
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === active ? "w-7 bg-brand" : "w-1.5 bg-navy/15"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Steps ─ */}
          <div className="hiw-steps relative">
            <div aria-hidden="true" className="absolute bottom-8 left-6 top-8 hidden w-px bg-navy/10 lg:block" />
            <div
              aria-hidden="true"
              className="hiw-progress absolute bottom-8 left-6 top-8 hidden w-[3px] -translate-x-[1px] rounded-full bg-gradient-to-b from-brand to-accent lg:block"
            />

            {STEPS.map((s, i) => {
              const Icon = ICONS[s.icon];
              return (
                <div
                  key={s.title}
                  className={`hiw-step hiw-step-${i} relative flex flex-col justify-center py-8 transition-opacity duration-500 lg:min-h-[52vh] lg:pl-20 ${
                    motionOk ? (i === active ? "lg:opacity-100" : "lg:opacity-35") : ""
                  }`}
                >
                  <span
                    className={`absolute left-0 top-8 hidden h-12 w-12 items-center justify-center rounded-full border-2 font-display text-sm font-extrabold transition-all duration-500 lg:flex ${
                      i === active
                        ? "border-brand bg-gradient-to-br from-brand to-accent text-white shadow-glow"
                        : "border-navy/10 bg-white text-navy/45"
                    }`}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-cream text-accent lg:hidden">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-xs font-extrabold uppercase tracking-[0.24em] text-brand lg:hidden">
                      Step 0{i + 1}
                    </span>
                    <Icon className="hidden h-6 w-6 text-brand lg:block" aria-hidden="true" />
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-navy sm:text-[1.7rem]">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-navy/60">{s.text}</p>

                  {/* mini phone on mobile */}
                  <div className="mt-8 w-44 self-center lg:hidden">
                    <PhoneMockup screen={SCREENS[s.screen]} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
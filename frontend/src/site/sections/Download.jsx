import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkle, Download as DownloadIcon } from "lucide-react";
import PhoneMockup from "../components/PhoneMockup";
import StoreButtons from "../components/StoreButtons";
import { SCREENS, DOWNLOADS } from "../config";

gsap.registerPlugin(ScrollTrigger);

export default function Download() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".dl-banner", {
        y: 70,
        autoAlpha: 0,
        scale: 0.97,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });
      gsap.from(".dl-phone", {
        y: 110,
        autoAlpha: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 65%", once: true },
      });
      /* breathing CTA */
      gsap.to(".dl-ctas", {
        scale: 1.02,
        duration: 1.7,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 1.5,
      });
      gsap.to(".dl-visual", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="download" ref={ref} className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="dl-banner relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-accent px-6 py-14 shadow-[0_50px_120px_-40px_rgba(242,87,43,0.7)] sm:rounded-[3rem] sm:px-12 lg:px-16 lg:py-20">
          {/* decorations */}
          <div aria-hidden="true" className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-white/10" />
          <div aria-hidden="true" className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-navy/10" />
          <div aria-hidden="true" className="dot-grid-light absolute inset-0 opacity-30" />
          <Sparkle aria-hidden="true" className="animate-float absolute left-[8%] top-12 h-6 w-6 fill-white/40 text-white/40" />
          <Sparkle aria-hidden="true" className="animate-float-slow absolute bottom-14 left-[45%] h-4 w-4 fill-white/30 text-white/30" style={{ animationDelay: "1.2s" }} />

          <div className="relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
            {/* ── Copy ── */}
            <div>
              <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.28em] text-white/85">
                <DownloadIcon className="h-4 w-4" aria-hidden="true" /> Get the app
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-4xl lg:text-[3.1rem]">
                Bring the Taste of Bagaha to Your Phone.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                Download the Mishra Ji Champaran Wale app and discover your favourite local sweets,
                ice creams and snacks.
              </p>

              <div className="dl-ctas mt-8 inline-block origin-left">
                <StoreButtons
                  variant="banner"
                  showIos={Boolean(DOWNLOADS.iosUrl)}
                  whatsappFallback={!DOWNLOADS.iosUrl}
                />
              </div>

              {DOWNLOADS.qrImage && (
                <div className="mt-6 inline-flex items-center gap-4 rounded-2xl bg-white/10 p-3 pr-5 backdrop-blur-sm">
                  <img
                    src={DOWNLOADS.qrImage}
                    alt="QR code linking to the app download"
                    className="h-20 w-20 rounded-xl bg-white object-cover"
                  />
                  <span className="text-sm font-semibold text-white/90">
                    Scan to download
                    <span className="block text-xs font-medium text-white/60">Point your camera at the code</span>
                  </span>
                </div>
              )}

              <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.26em] text-white/60">
                Sweets · Namkeen · Ice Cream · Bagaha
              </p>
            </div>

            {/* ── Phones ── */}
            <div className="dl-visual relative mx-auto w-full max-w-[360px]" aria-hidden="false">
              <div className="dl-phone relative z-10 w-[58%] [transform:rotate(-7deg)]">
                <div className="animate-float">
                  <PhoneMockup screen={SCREENS.brand} />
                </div>
              </div>
              <div className="dl-phone absolute right-0 top-10 w-[58%] [transform:rotate(8deg)]">
                <div className="animate-float-slow" style={{ animationDelay: "0.9s" }}>
                  <PhoneMockup screen={SCREENS.jamun} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
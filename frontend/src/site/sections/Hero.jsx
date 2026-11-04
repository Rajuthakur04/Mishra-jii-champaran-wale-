import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Store, Bike, ChevronDown, ArrowRight } from "lucide-react";
import PhoneMockup from "../components/PhoneMockup";
import StoreButtons from "../components/StoreButtons";
import { SCREENS, BUSINESS, IMAGES } from "../config";
import { getPublicShopsApi } from "../../admin/services/api";

gsap.registerPlugin(ScrollTrigger);

const LINE_1 = ["Your", "Favourite"];
const LINE_2 = ["Sweets,"];
const LINE_3 = ["Delivered", "Fresh."];

function Words({ words, className = "" }) {
  return words.map((w) => (
    <span key={w} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
      <span className={`hero-word inline-block will-change-transform ${className}`}>{w}</span>
      {"\u00A0"}
    </span>
  ));
}

export default function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const clusterRef = useRef(null);
  const [partnerShop, setPartnerShop] = useState(null);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await getPublicShopsApi({ featured: "true" });
        if (res.data?.success && res.data.shops?.length > 0) {
          setPartnerShop(res.data.shops[0]);
        }
      } catch (err) {
        // Fallback to static config
      }
    };
    fetchPartner();
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-badge", { y: 24, autoAlpha: 0, duration: 0.7 }, 0.1)
        .from(".hero-word", { yPercent: 118, duration: 0.9, stagger: 0.06 }, 0.2)
        .from(
          ".hero-underline",
          { scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power3.inOut" },
          0.95
        )
        .from(".hero-sub", { y: 26, autoAlpha: 0, duration: 0.8 }, 0.75)
        .from(".hero-ctas", { y: 22, autoAlpha: 0, duration: 0.7 }, 0.9)
        .from(".hero-partner", { y: 18, autoAlpha: 0, duration: 0.7 }, 1.05)
        .from(".hero-phone-back", { y: 170, autoAlpha: 0, rotate: -16, duration: 1.5, ease: "power3.out" }, 0.45)
        .from(".hero-phone-front", { y: 200, autoAlpha: 0, rotate: 12, duration: 1.5, ease: "power3.out" }, 0.6)
        .from(".hero-chip", { scale: 0, autoAlpha: 0, stagger: 0.14, duration: 0.7, ease: "back.out(1.8)" }, 1.2)
        .from(".hero-scroll", { autoAlpha: 0, duration: 0.6 }, 1.6);

      /* subtle scroll parallax — stage and copy drift at different speeds */
      gsap.to(".hero-stage", {
        yPercent: -7,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-copy", {
        yPercent: 10,
        autoAlpha: 0.3,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, sectionRef);

    /* mouse-based 3D tilt (fine pointers only) */
    let cleanupMove = () => {};
    const stage = stageRef.current;
    const cluster = clusterRef.current;
    if (window.matchMedia("(pointer: fine)").matches && stage && cluster) {
      const rx = gsap.quickTo(cluster, "rotationX", { duration: 0.9, ease: "power3.out" });
      const ry = gsap.quickTo(cluster, "rotationY", { duration: 0.9, ease: "power3.out" });
      const onMove = (e) => {
        const r = stage.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
      };
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
      cleanupMove = () => {
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
      };
    }

    return () => {
      cleanupMove();
      ctx.revert();
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative overflow-hidden bg-cream">
      {/* ambient warm layers */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(55% 45% at 88% 8%, rgba(244,115,66,0.16), transparent 65%), radial-gradient(45% 40% at 2% 92%, rgba(244,115,66,0.1), transparent 60%)",
        }}
      />
      <div aria-hidden="true" className="dot-grid absolute right-8 top-28 hidden h-56 w-56 opacity-50 lg:block" />
      <span
        aria-hidden="true"
        className="text-outline-navy absolute -top-4 right-4 hidden select-none font-display text-[8.5rem] font-extrabold leading-none xl:block"
      >
        मिठाई
      </span>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-40">
        {/* ── Copy ── */}
        <div className="hero-copy relative z-10">
          <span className="hero-badge inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy shadow-soft ring-1 ring-navy/5">
            <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
            Bagaha's own mithai &amp; ice cream app
          </span>

          <h1 className="mt-6 font-display text-[2.7rem] font-bold leading-[1.05] tracking-[-0.03em] text-navy sm:text-6xl lg:text-[4.2rem] xl:text-[4.7rem]">
            <Words words={LINE_1} />
            <Words words={LINE_2} />
            <br className="hidden sm:block" />
            <span className="relative inline-block text-brand">
              <Words words={LINE_3} />
              <svg
                aria-hidden="true"
                viewBox="0 0 240 14"
                fill="none"
                className="hero-underline absolute -bottom-1 left-0 w-[96%] sm:-bottom-2"
              >
                <path
                  d="M4 10 C 62 3, 168 2, 236 8"
                  stroke="#F2572B"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="hero-sub mt-6 max-w-xl text-base leading-relaxed text-navy/70 sm:text-lg">
            Discover delicious Indian sweets, namkeen and ice creams from your favourite local shops
            in Bagaha. Order through the Mishra Ji app and enjoy doorstep delivery.
          </p>

          <div className="hero-ctas mt-8">
            <StoreButtons showIos />
          </div>

          <Link
            to={partnerShop ? `/shops/${partnerShop.slug}` : "/shops"}
            className="hero-partner mt-9 inline-flex items-center gap-3 rounded-2xl bg-white/70 p-2 pr-4 shadow-sm ring-1 ring-navy/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md group"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-cream-deep text-accent group-hover:scale-105 transition-transform">
              <Store className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand flex items-center gap-1">
                Featured partner
              </span>
              <span className="text-sm font-bold text-navy group-hover:text-brand transition-colors">
                {partnerShop ? `${partnerShop.name} · ${partnerShop.city}` : `${BUSINESS.partner.name} · ${BUSINESS.partner.location}`}
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-navy/40 group-hover:text-brand group-hover:translate-x-1 transition-all ml-1" />
          </Link>
        </div>

        {/* ── 3D phone stage ── */}
        <div ref={stageRef} className="hero-stage relative" style={{ perspective: "1300px" }}>
          {/* spinning dashed halo */}
          <div
            aria-hidden="true"
            className="animate-spin-slow absolute left-1/2 top-1/2 -z-0 h-[105%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 aspect-square rounded-full border-2 border-dashed border-brand/25"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-3xl"
          />

          <div
            ref={clusterRef}
            className="relative mx-auto w-full max-w-[400px] will-change-transform [transform-style:preserve-3d] sm:max-w-[480px] lg:max-w-[520px]"
          >
            {/* back phone */}
            <div className="hero-phone-back absolute left-0 top-[6%] z-0 w-[55%]">
              <div className="[transform:rotate(-9deg)_translateZ(-60px)]">
                <div className="animate-float-slow">
                  <PhoneMockup screen={SCREENS.laddu} eager />
                </div>
              </div>
            </div>

            {/* front phone */}
            <div className="hero-phone-front relative z-10 ml-auto w-[63%]">
              <div className="[transform:rotate(6deg)_translateZ(50px)]">
                <div className="animate-float">
                  <PhoneMockup screen={SCREENS.home} eager />
                </div>
              </div>
            </div>

            {/* floating chips */}
            <div className="hero-chip absolute -right-2 top-[5%] z-20 sm:-right-6">
              <div className="animate-float flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lift ring-1 ring-navy/5" style={{ animationDelay: "0.8s" }}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-white">
                  <Bike className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-display text-sm font-bold text-navy">Doorstep Delivery</span>
                  <span className="text-[11px] font-medium text-navy/55">Across Bagaha</span>
                </span>
              </div>
            </div>

            <div className="hero-chip absolute -left-2 bottom-[12%] z-20 sm:-left-8">
              <div className="animate-float-slow flex items-center gap-2.5 rounded-2xl bg-white p-2.5 pr-4 shadow-lift ring-1 ring-navy/5" style={{ animationDelay: "1.6s" }}>
                <img
                  src={IMAGES.gulabJamun}
                  alt=""
                  loading="lazy"
                  className="h-11 w-11 rounded-xl object-cover"
                />
                <span className="flex flex-col leading-tight">
                  <span className="font-display text-sm font-bold text-navy">Gulab Jamun</span>
                  <span className="text-[11px] font-medium text-brand">Discover in the app</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#about"
        className="hero-scroll absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 md:flex"
        aria-label="Scroll to About section"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/40">Scroll</span>
        <ChevronDown className="animate-bob h-4 w-4 text-brand" aria-hidden="true" />
      </a>
    </section>
  );
}
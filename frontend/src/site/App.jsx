import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./components/Navbar";
import SEO from "./components/SEO";
import Hero from "./sections/Hero";
import Ticker from "./sections/Ticker";
import About from "./sections/About";
import Features from "./sections/Features";
import HowItWorks from "./sections/HowItWorks";
import Partner from "./sections/Partner";
import Showcase from "./sections/Showcase";
import Benefits from "./sections/Benefits";
import FAQ from "./sections/FAQ";
import Download from "./sections/Download";
import Footer from "./sections/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useLayoutEffect(() => {
    /* Global scroll reveals — skipped entirely for reduced-motion users */
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 42,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          delay: parseFloat(el.dataset.delay || "0"),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <SEO
        title="Mishra Ji Champaran Wale — Official Website | Best Champaran Pedha & Sweets in Bagaha"
        canonicalUrl="https://mishrajichamparnwale.com/"
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-navy focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Ticker />
        <About />
        <Features />
        <HowItWorks />
        <Partner />
        <Showcase />
        <Benefits />
        <FAQ />
        <Download />
      </main>
      <Footer />
    </div>
  );
}
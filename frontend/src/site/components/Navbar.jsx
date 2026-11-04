import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Download, Store, Shield } from "lucide-react";
import Logo from "./Logo";
import { NAV_LINKS } from "../config";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 shadow-[0_12px_40px_-20px_rgba(10,17,46,0.3)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 sm:px-6 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "true" : undefined}
              className={`relative text-sm font-medium transition-colors duration-300 ${
                active === link.href ? "text-navy" : "text-navy/60 hover:text-navy"
              }`}
            >
              {link.label}
              <span
                aria-hidden="true"
                className={`absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand transition-all duration-300 ${
                  active === link.href ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              />
            </a>
          ))}
          <Link
            to="/shops"
            className="relative text-sm font-bold text-brand hover:text-accent transition-colors flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Shops</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            to="/admin/login"
            title="Admin Login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-navy/10 text-xs font-bold text-navy/80 hover:bg-cream transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-brand" />
            <span>Admin</span>
          </Link>
          <a
            href="#download"
            className="hidden items-center gap-2 rounded-full bg-gradient-to-br from-brand to-accent px-5 py-2.5 font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-14px_rgba(242,87,43,0.7)] sm:inline-flex"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download App
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-xl bg-white text-navy shadow-soft ring-1 ring-navy/10 transition hover:bg-cream lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        className={`absolute inset-x-4 top-full mt-2 origin-top rounded-3xl bg-white p-4 shadow-lift ring-1 ring-navy/5 transition-all duration-300 lg:hidden ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-4 py-3 font-display text-base font-semibold transition ${
                active === link.href ? "bg-cream text-brand" : "text-navy hover:bg-cream"
              }`}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/shops"
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-3 font-display text-base font-bold text-brand bg-cream flex items-center justify-between"
          >
            <span>Shops in Bagaha</span>
            <Store className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/login"
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-2.5 font-display text-sm font-semibold text-navy/70 hover:bg-cream flex items-center justify-between border-t border-gray-100 mt-1"
          >
            <span>Admin Portal</span>
            <Shield className="w-4 h-4 text-brand" />
          </Link>
          <a
            href="#download"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand to-accent px-5 py-3.5 font-display text-base font-bold text-white shadow-glow"
          >
            <Download className="h-5 w-5" aria-hidden="true" /> Download App
          </a>
        </nav>
      </div>
    </header>
  );
}
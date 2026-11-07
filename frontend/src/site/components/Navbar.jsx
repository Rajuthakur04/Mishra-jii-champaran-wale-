import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Download, Store, Shield } from "lucide-react";
import Logo from "./Logo";
import { NAV_LINKS } from "../config";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/shops")) {
      return "/shops";
    }
    return window.location.hash || "#home";
  });

  // Track window scroll for navbar background blur/shrink
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update active state when route changes
  useEffect(() => {
    if (location.pathname.startsWith("/shops")) {
      setActive("/shops");
      return;
    }

    if (!isHome) {
      setActive("");
      return;
    }

    // On home page, track active section via IntersectionObserver
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

    if (sections.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(`#${e.target.id}`);
          }
        });
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [isHome, location.pathname]);

  // Smooth scroll handler for both intra-page and cross-page clicks
  const handleNavClick = (e, href) => {
    e.preventDefault();
    setOpen(false);

    if (!href.startsWith("#")) {
      navigate(href);
      return;
    }

    const id = href.replace("#", "");

    if (isHome) {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "#home");
        setActive("#home");
        return;
      }

      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 84;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
        setActive(href);
      }
    } else {
      // From another page (/shops, /admin, etc.), navigate to home with the target hash
      navigate(`/${href}`);
    }
  };

  const handleShopsClick = (e) => {
    setOpen(false);
    if (location.pathname === "/shops") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isShopsActive = location.pathname.startsWith("/shops");

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

        {/* ── Desktop Navigation ── */}
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isHome && active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={isActive ? "true" : undefined}
                className={`relative text-sm font-medium transition-colors duration-300 ${
                  isActive ? "text-navy font-semibold" : "text-navy/60 hover:text-navy"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand transition-all duration-300 ${
                    isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </a>
            );
          })}

          {/* Dedicated Shops Directory Link */}
          <Link
            to="/shops"
            onClick={handleShopsClick}
            aria-current={isShopsActive ? "true" : undefined}
            className={`relative text-sm font-bold transition-colors flex items-center gap-1.5 ${
              isShopsActive ? "text-brand" : "text-navy/70 hover:text-brand"
            }`}
          >
            <Store className="w-3.5 h-3.5 text-brand" />
            <span>Shops</span>
            <span
              aria-hidden="true"
              className={`absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand transition-all duration-300 ${
                isShopsActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            />
          </Link>
        </nav>

        {/* ── Action Buttons ── */}
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
            onClick={(e) => handleNavClick(e, "#download")}
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

      {/* ── Mobile Panel ── */}
      <div
        id="mobile-nav"
        className={`absolute inset-x-4 top-full mt-2 origin-top rounded-3xl bg-white p-4 shadow-lift ring-1 ring-navy/5 transition-all duration-300 lg:hidden ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = isHome && active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`rounded-xl px-4 py-3 font-display text-base font-semibold transition ${
                  isActive ? "bg-cream text-brand font-bold" : "text-navy hover:bg-cream"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <Link
            to="/shops"
            onClick={handleShopsClick}
            className={`rounded-xl px-4 py-3 font-display text-base font-bold flex items-center justify-between transition ${
              isShopsActive ? "bg-brand/10 text-brand" : "text-brand bg-cream hover:bg-brand/15"
            }`}
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
            onClick={(e) => handleNavClick(e, "#download")}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand to-accent px-5 py-3.5 font-display text-base font-bold text-white shadow-glow"
          >
            <Download className="h-5 w-5" aria-hidden="true" /> Download App
          </a>
        </nav>
      </div>
    </header>
  );
}

import { MapPin, Phone, Mail, Heart, ExternalLink, Shield, Store, Sparkles, MessageCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import StoreButtons from "../components/StoreButtons";
import { BUSINESS } from "../config";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "App Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Download App", href: "#download" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleLinkClick = (e, href) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const id = href.replace("#", "");

    if (isHome) {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "#home");
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        const navbarHeight = 84;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
      }
    } else {
      navigate(`/${href}`);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#070c22] pt-16 text-white border-t border-white/5">
      {/* Glow backgrounds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(50% 50% at 85% 0%, rgba(244,115,66,0.14), transparent 70%), radial-gradient(40% 40% at 10% 100%, rgba(242,87,43,0.08), transparent 60%)",
        }}
      />

      {/* ── Top Trust Highlights Bar ── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-3xl bg-white/[0.04] p-5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3.5 px-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand border border-brand/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h5 className="font-display font-bold text-sm text-white">100% Fresh & Authentic</h5>
              <p className="text-xs text-white/50">Pure desi ghee & traditional recipes</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-3 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/20">
              <Store className="h-5 w-5" />
            </span>
            <div>
              <h5 className="font-display font-bold text-sm text-white">Trusted Local Shops</h5>
              <p className="text-xs text-white/50">Sourced directly from Bagaha counters</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-3 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300 border border-emerald-400/20">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <h5 className="font-display font-bold text-sm text-white">Instant WhatsApp Orders</h5>
              <p className="text-xs text-white/50">Direct delivery to your doorstep</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Columns ── */}
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1.2fr_1.1fr]">
        {/* Brand Info */}
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
            Your favourite local sweets, namkeen and ice creams — sourced from trusted shops in
            Bagaha and delivered straight to your doorstep through one seamless app.
          </p>
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-white/55">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            {BUSINESS.address}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={BUSINESS.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Chat</span>
            </a>
            <Link
              to="/shops"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:text-brand hover:border-brand/40 transition-all"
            >
              <Store className="w-3.5 h-3.5 text-brand" />
              <span>All Shops</span>
            </Link>
          </div>
        </div>

        {/* Explore Links */}
        <nav aria-label="Footer Navigation">
          <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-brand">Explore</h4>
          <ul className="mt-4 flex flex-col gap-2.5">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleLinkClick(e, l.href)}
                  className="text-sm font-medium text-white/70 transition-colors hover:text-brand flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="h-1 w-1 rounded-full bg-brand/40" />
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/shops"
                className="text-sm font-bold text-amber-300 hover:text-white transition-colors flex items-center gap-1.5 mt-1"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Local Shops Directory</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contact Information */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-brand">Contact & Orders</h4>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex items-center gap-2.5 text-sm font-medium text-white/80 transition-colors hover:text-brand"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand/10 text-brand border border-brand/20">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span>{BUSINESS.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={BUSINESS.emailHref}
                className="inline-flex items-center gap-2.5 text-sm font-medium text-white/80 transition-colors hover:text-brand break-all"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand/10 text-brand border border-brand/20">
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span>{BUSINESS.email}</span>
              </a>
            </li>
            <li className="mt-1 p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/60">
              <span className="font-bold text-white/80 block mb-0.5">Flagship Partner Shop:</span>
              {BUSINESS.partner.name} · {BUSINESS.partner.location}
            </li>
          </ul>
        </div>

        {/* App Download & Admin */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-brand">Get the App</h4>
          <p className="mt-4 text-xs leading-relaxed text-white/60">
            Discover Bagaha's fresh sweets, namkeen and frozen desserts on your smartphone.
          </p>
          <StoreButtons variant="light" showIos={false} className="mt-4" />

          {/* Admin Login Portal shortcut */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-brand transition-colors group"
            >
              <Shield className="w-3.5 h-3.5 text-brand/70 group-hover:text-brand" />
              <span>Shop Owner & Admin Portal</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>

      {/* Watermark Brand Art */}
      <div
        aria-hidden="true"
        className="text-outline-white pointer-events-none mt-12 select-none whitespace-nowrap text-center font-display text-[18vw] font-black leading-[0.75] opacity-40 lg:text-[11rem]"
      >
        MISHRA JI
      </div>

      {/* ── Bottom Credits Bar ── */}
      <div className="relative border-t border-white/10 bg-black/25">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center text-xs text-white/50 md:flex-row sm:px-6">
          <p className="order-1 md:order-1">
            © {year} <span className="font-semibold text-white/70">{BUSINESS.name}</span>. All rights reserved.
          </p>

          {/* 🌟 Designed & Developed by nminovation.com Link 🌟 */}
          <div className="order-3 md:order-2">
            <a
              href="https://nminovation.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-brand/50 px-4 py-1.5 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_-5px_rgba(244,115,66,0.4)]"
            >
              <span className="text-white/60 group-hover:text-white/90 transition-colors">
                Designed & Developed by
              </span>
              <span className="font-bold text-white group-hover:text-brand underline decoration-brand/60 underline-offset-4 transition-colors flex items-center gap-1">
                nminovation.com
                <ExternalLink className="w-3 h-3 text-brand transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>

          <p className="order-2 md:order-3 inline-flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 fill-brand text-brand animate-pulse" aria-hidden="true" /> in Bagaha, Bihar
          </p>
        </div>
      </div>
    </footer>
  );
}

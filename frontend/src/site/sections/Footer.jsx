import { MapPin, Phone, Mail, Heart } from "lucide-react";
import Logo from "../components/Logo";
import StoreButtons from "../components/StoreButtons";
import { BUSINESS } from "../config";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "App Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Download App", href: "#download" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-navy pt-20 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(45% 50% at 90% 0%, rgba(244,115,66,0.12), transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_1.2fr_1.1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            Your favourite local sweets, namkeen and ice creams — sourced from trusted shops in
            Bagaha and delivered to your doorstep through one app.
          </p>
          <p className="mt-5 flex items-start gap-2 text-sm text-white/60">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            {BUSINESS.address}
          </p>
        </div>

        <nav aria-label="Footer">
          <h4 className="text-xs font-bold uppercase tracking-[0.26em] text-white/40">Explore</h4>
          <ul className="mt-5 flex flex-col gap-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm font-medium text-white/70 transition-colors hover:text-brand">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.26em] text-white/40">Contact</h4>
          <ul className="mt-5 flex flex-col gap-3.5">
            <li>
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex items-center gap-2.5 text-sm font-medium text-white/70 transition-colors hover:text-brand"
              >
                <Phone className="h-4 w-4 text-brand" aria-hidden="true" /> {BUSINESS.phone}
              </a>
            </li>
            <li>
              <a
                href={BUSINESS.emailHref}
                className="inline-flex items-start gap-2.5 break-all text-sm font-medium text-white/70 transition-colors hover:text-brand"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" /> {BUSINESS.email}
              </a>
            </li>
            <li className="text-sm leading-relaxed text-white/50">
              Featured partner: {BUSINESS.partner.name}, {BUSINESS.partner.location}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.26em] text-white/40">Get the app</h4>
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            Bring Bagaha's sweet shops to your phone.
          </p>
          <StoreButtons variant="light" showIos={false} className="mt-5" />
        </div>
      </div>

      {/* watermark */}
      <div
        aria-hidden="true"
        className="text-outline-white pointer-events-none mt-14 select-none whitespace-nowrap text-center font-display text-[19vw] font-extrabold leading-[0.8] lg:text-[11.5rem]"
      >
        MISHRA JI
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-7 text-center text-xs text-white/45 sm:flex-row sm:px-6 sm:text-left">
          <p>
            © {year} {BUSINESS.name}. All rights reserved.
          </p>
          <p className="font-medium">{BUSINESS.domain}</p>
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 fill-brand text-brand" aria-hidden="true" /> in Bagaha, Bihar
          </p>
        </div>
      </div>
    </footer>
  );
}
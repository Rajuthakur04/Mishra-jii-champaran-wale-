import { MapPin, Signal, Wifi, BatteryFull, Store, Bike, Home } from "lucide-react";
import { BUSINESS } from "../config";

/**
 * Realistic device frame. All inner sizing uses container-query units
 * (cqw) so the mockup scales perfectly from 140px to 340px wide.
 * If `screen.image` is set in config.js (a REAL app screenshot), it is
 * rendered instead of the brand showcase artwork.
 */
export default function PhoneMockup({ screen, className = "", eager = false }) {
  return (
    <div
      role="img"
      aria-label={screen.alt}
      className={`relative aspect-[9/19] select-none [container-type:inline-size] ${className}`}
    >
      {/* side buttons */}
      <div aria-hidden="true" className="absolute -left-[1.2cqw] top-[20cqw] h-[9cqw] w-[1.4cqw] rounded-full bg-[#1b2242]" />
      <div aria-hidden="true" className="absolute -left-[1.2cqw] top-[32cqw] h-[14cqw] w-[1.4cqw] rounded-full bg-[#1b2242]" />
      <div aria-hidden="true" className="absolute -right-[1.2cqw] top-[26cqw] h-[18cqw] w-[1.4cqw] rounded-full bg-[#1b2242]" />

      {/* bezel */}
      <div className="absolute inset-0 rounded-[16cqw] bg-[#10152b] p-[2.6cqw] shadow-[0_45px_90px_-30px_rgba(10,17,46,0.5)] ring-1 ring-white/15">
        <div className="relative h-full w-full overflow-hidden rounded-[13.5cqw] bg-navy">
          {screen.image ? (
            <img
              src={screen.image}
              alt=""
              loading={eager ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <ScreenArtwork screen={screen} eager={eager} />
          )}

          {/* dynamic island */}
          <div aria-hidden="true" className="absolute left-1/2 top-[3.2cqw] h-[6.4cqw] w-[26cqw] -translate-x-1/2 rounded-full bg-black/95" />
          {/* home indicator */}
          <div aria-hidden="true" className="absolute bottom-[2.2cqw] left-1/2 h-[1.2cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-white/70" />
          {/* glare */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[13.5cqw] bg-gradient-to-br from-white/15 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="relative z-10 flex items-center justify-between px-[8cqw] pt-[4cqw] text-white">
      <span className="text-[3.6cqw] font-semibold tracking-wide">9:41</span>
      <span className="flex items-center gap-[1.6cqw]">
        <Signal className="h-[3.6cqw] w-[3.6cqw]" />
        <Wifi className="h-[3.6cqw] w-[3.6cqw]" />
        <BatteryFull className="h-[4.2cqw] w-[4.2cqw]" />
      </span>
    </div>
  );
}

function BrandRow() {
  return (
    <div className="relative z-10 mt-[4cqw] flex items-center gap-[2.6cqw] px-[6.5cqw]">
      <img
        src="/images/logo-icon.jpg"
        alt="Mishra Ji"
        className="h-[9cqw] w-[9cqw] shrink-0 rounded-[2.8cqw] object-cover ring-1 ring-white/20 shadow-md"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[4.4cqw] font-bold text-white">Mishra Ji</span>
        <span className="mt-[1cqw] flex items-center gap-[1cqw] text-[2.9cqw] font-medium text-white/75">
          <MapPin className="h-[3cqw] w-[3cqw] text-brand" /> {BUSINESS.city}, West Champaran
        </span>
      </span>
    </div>
  );
}

function ScreenArtwork({ screen, eager }) {
  if (screen.kind === "brand") return <BrandScreen />;
  if (screen.kind === "delivery") return <DeliveryScreen />;

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <img
        src={screen.photo}
        alt=""
        loading={eager ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-navy/80 via-navy/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-navy/95 via-navy/55 to-transparent" />
      <StatusBar />
      <BrandRow />
      <div className="absolute inset-x-0 bottom-0 px-[6.5cqw] pb-[8cqw]">
        <span className="inline-block rounded-full bg-brand px-[3.4cqw] py-[1.4cqw] text-[2.8cqw] font-bold uppercase tracking-[0.14em] text-white">
          {screen.chip}
        </span>
        <p className="mt-[2.8cqw] font-display text-[7.6cqw] font-bold leading-[1.08] text-white">
          {screen.title}
        </p>
        <p className="mt-[1.6cqw] text-[3.6cqw] font-medium text-white/75">{screen.subtitle}</p>
        {screen.categories && (
          <div className="mt-[3.4cqw] flex gap-[2cqw]">
            {screen.categories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-white/15 px-[3.2cqw] py-[1.4cqw] text-[2.9cqw] font-semibold text-white backdrop-blur-sm"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BrandScreen() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-[#2d0204]">
      <div className="absolute -right-[30cqw] -top-[20cqw] h-[80cqw] w-[80cqw] rounded-full bg-brand/25 blur-[18cqw]" />
      <div className="absolute -bottom-[24cqw] -left-[26cqw] h-[70cqw] w-[70cqw] rounded-full bg-accent/20 blur-[16cqw]" />
      <div className="dot-grid-light absolute inset-0 opacity-20" />
      <StatusBar />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[6cqw] text-center">
        <div className="overflow-hidden rounded-2xl shadow-[0_10cqw_25cqw_-6cqw_rgba(0,0,0,0.85)] ring-1 ring-amber-400/30">
          <img
            src="/images/logo.jpg"
            alt="Mishra Ji Champaran Wale"
            className="w-[82cqw] object-contain"
          />
        </div>
        <p className="mt-[5cqw] font-display text-[4cqw] font-bold tracking-wider text-amber-200">
          Swad · Parampara · Vishwas
        </p>
        <span className="mt-[3cqw] h-[0.5cqw] w-[14cqw] rounded-full bg-amber-400/30" />
        <p className="mt-[3cqw] text-[3.4cqw] font-medium text-white/80">
          Sweets · Namkeen · Ice Cream
        </p>
      </div>
      <p className="absolute inset-x-0 bottom-[8cqw] flex items-center justify-center gap-[1.6cqw] text-[3.1cqw] font-medium text-white/60">
        <MapPin className="h-[3.4cqw] w-[3.4cqw] text-brand" /> Bagaha, West Champaran
      </p>
    </div>
  );
}

function DeliveryScreen() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-navy">
      <div className="absolute -left-[24cqw] top-[10cqw] h-[70cqw] w-[70cqw] rounded-full bg-brand/20 blur-[16cqw]" />
      <div className="dot-grid-light absolute inset-0 opacity-25" />
      <StatusBar />
      <BrandRow />
      <div className="absolute inset-x-0 top-[34%] flex flex-col items-center px-[8cqw] text-center">
        <div className="flex w-full items-center justify-between px-[4cqw]">
          <span className="grid h-[12cqw] w-[12cqw] place-items-center rounded-full bg-white/10 text-white">
            <Store className="h-[6cqw] w-[6cqw]" />
          </span>
          <span className="grid h-[12cqw] w-[12cqw] place-items-center rounded-full bg-brand text-white shadow-[0_6cqw_16cqw_-4cqw_rgba(244,115,66,0.9)]">
            <Home className="h-[6cqw] w-[6cqw]" />
          </span>
        </div>
        <svg viewBox="0 0 200 40" className="-mt-[9cqw] w-[64cqw]" fill="none">
          <path
            d="M8 14 C 60 44, 140 44, 192 14"
            stroke="#F47342"
            strokeWidth="3"
            strokeDasharray="7 8"
            strokeLinecap="round"
          />
        </svg>
        <span className="-mt-[4cqw] grid h-[16cqw] w-[16cqw] place-items-center rounded-full bg-gradient-to-br from-brand to-accent text-white">
          <Bike className="h-[8cqw] w-[8cqw]" />
        </span>
        <p className="mt-[6cqw] font-display text-[7cqw] font-bold leading-tight text-white">
          Seedha aapke doorstep
        </p>
        <p className="mt-[2cqw] text-[3.5cqw] font-medium text-white/70">
          Sourced from local shops · Delivered in Bagaha
        </p>
      </div>
    </div>
  );
}
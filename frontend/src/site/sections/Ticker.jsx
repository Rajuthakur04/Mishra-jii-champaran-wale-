import { Sparkle } from "lucide-react";
import { TICKER_ITEMS } from "../config";

function Row() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="flex items-center">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-sm font-semibold uppercase tracking-[0.2em] text-cream/90">
            {item}
          </span>
          <Sparkle className="h-4 w-4 shrink-0 fill-brand text-brand" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <div className="marquee-viewport relative border-y border-white/10 bg-navy py-4" aria-label="Treats you can discover in the app">
      <div className="marquee-track">
        <Row />
        <div aria-hidden="true" className="flex items-center">
          <Row />
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-navy to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-navy to-transparent" />
    </div>
  );
}
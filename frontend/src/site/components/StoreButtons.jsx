import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, Apple, X, MessageCircle, Phone, Mail } from "lucide-react";
import { BUSINESS, DOWNLOADS } from "../config";

const androidHref = () => DOWNLOADS.androidUrl || DOWNLOADS.apkUrl || "";
const iosHref = () => DOWNLOADS.iosUrl || "";

/**
 * Store buttons driven ONLY by verified URLs in config.js.
 * If a URL is empty, the button opens an honest "Get the app" dialog
 * with the real contact channels — never a fake store link.
 */
export default function StoreButtons({
  variant = "light", // "light" (on white) | "banner" (on orange)
  showIos = true,
  whatsappFallback = false,
  className = "",
}) {
  const [modal, setModal] = useState(null);

  const base =
    "group inline-flex items-center gap-3 rounded-2xl px-5 py-3 font-body transition-all duration-300 hover:-translate-y-1 focus-visible:-translate-y-1";
  const styles =
    variant === "banner"
      ? {
        primary: "bg-white text-navy shadow-[0_18px_40px_-14px_rgba(10,17,46,0.45)] hover:shadow-[0_24px_50px_-14px_rgba(10,17,46,0.55)]",
        secondary: "border-2 border-white/70 text-white hover:bg-white/10",
      }
      : {
        primary: "bg-gradient-to-br from-brand to-accent text-white shadow-glow hover:shadow-[0_24px_54px_-14px_rgba(242,87,43,0.65)]",
        secondary: "border-2 border-navy/15 bg-white text-navy hover:border-navy/35 hover:shadow-soft",
      };

  const label = (small, big) => (
    <span className="flex flex-col items-start leading-tight">
      <span className="text-[11px] font-medium opacity-75">{small}</span>
      <span className="font-display text-base font-bold tracking-tight">{big}</span>
    </span>
  );

  const a = androidHref();
  const i = iosHref();

  return (
    <>
      <div className={`flex flex-wrap items-center gap-4 ${className}`}>
        {a ? (
          <a href={a} target="_blank" rel="noopener noreferrer" className={`${base} ${styles.primary}`}>
            <Play className="h-6 w-6 fill-current" aria-hidden="true" />
            {label("Download for", "Android")}
          </a>
        ) : (
          <button type="button" onClick={() => setModal("Android")} className={`${base} ${styles.primary}`}>
            <Play className="h-6 w-6 fill-current" aria-hidden="true" />
            {label("Download for", "Android")}
          </button>
        )}

        {showIos &&
          (i ? (
            <a href={i} target="_blank" rel="noopener noreferrer" className={`${base} ${styles.secondary}`}>
              <Apple className="h-6 w-6 fill-current" aria-hidden="true" />
              {label("Download for", "iOS")}
            </a>
          ) : (
            <button type="button" onClick={() => setModal("iOS")} className={`${base} ${styles.secondary}`}>
              <Apple className="h-6 w-6 fill-current" aria-hidden="true" />
              {label("Download for", "iOS")}
            </button>
          ))}

        {whatsappFallback && (
          <a
            href={`${BUSINESS.whatsappHref}?text=${encodeURIComponent(
              "Namaste! Please share the Mishra Ji Champaran Wale app download link."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${base} ${styles.secondary}`}
          >
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
            {label("Get the link on", "WhatsApp")}
          </a>
        )}
      </div>

      {modal && <GetAppModal platform={modal} onClose={() => setModal(null)} />}
    </>
  );
}

function GetAppModal({ platform, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="getapp-title"
    >
      <button
        aria-label="Close dialog"
        className="absolute inset-0 cursor-default bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-lift">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-cream text-navy transition hover:bg-cream-deep"
        >
          <X className="h-4 w-4" />
        </button>
        <img
          src="/images/logo-icon.jpg"
          alt="Mishra Ji Champaran Wale"
          className="h-16 w-16 rounded-2xl object-cover shadow-glow ring-2 ring-brand/30"
        />
        <h3 id="getapp-title" className="mt-5 font-display text-2xl font-bold tracking-tight text-navy">
          Get the Mishra Ji app
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-navy/70">
          The {platform} store link hasn't been added to this page yet. Message or call us and we'll
          share the official <strong className="text-navy">Mishra Ji Champaran Wale</strong> app with
          you directly — it's just one message away.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={`${BUSINESS.whatsappHref}?text=${encodeURIComponent(
              `Namaste! Please share the Mishra Ji Champaran Wale app for ${platform}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand to-accent px-5 py-3.5 font-display text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp us
          </a>
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-navy/15 px-5 py-3 font-display text-sm font-bold text-navy transition hover:border-navy/35"
          >
            <Phone className="h-4 w-4 text-brand" /> {BUSINESS.phone}
          </a>
        </div>
        <a
          href={BUSINESS.emailHref}
          className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-navy/60 transition hover:text-brand"
        >
          <Mail className="h-3.5 w-3.5" /> {BUSINESS.email}
        </a>
      </div>
    </div>,
    document.body
  );
}
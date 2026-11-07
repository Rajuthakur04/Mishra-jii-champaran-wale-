import { Link, useLocation } from "react-router-dom";

export default function Logo({ light = false, className = "", variant = "standard" }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleClick = (e) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "#home");
    }
  };

  if (variant === "full") {
    return (
      <Link
        to="/#home"
        onClick={handleClick}
        aria-label="Mishra Ji Champaran Wale — back to top"
        className={`group inline-block ${className}`}
      >
        <img
          src="/images/logo.jpg"
          alt="Mishra Ji Champaran Wale"
          className="h-12 w-auto rounded-xl object-contain shadow-md transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
    );
  }

  return (
    <Link
      to="/#home"
      onClick={handleClick}
      aria-label="Mishra Ji Champaran Wale — back to top"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <img
        src="/images/logo-icon.jpg"
        alt="Mishra Ji Champaran Wale"
        className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl object-cover shadow-glow ring-2 ring-brand/30 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-bold tracking-tight ${
            light ? "text-white" : "text-navy"
          }`}
        >
          Mishra Ji
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-brand">
          Champaran Wale
        </span>
      </span>
    </Link>
  );
}
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Store } from "lucide-react";
import { PRODUCTS } from "../config";
import { getFeaturedMenuItemsApi } from "../../admin/services/api";

function Card({ product }) {
  const isDynamic = Boolean(product.shop && product.shop.slug);
  const photo = product.image || product.photo;
  const tag = product.tag || product.category || "Special";
  const shopName = product.shop?.name;

  const content = (
    <figure className="group relative h-72 w-56 shrink-0 overflow-hidden rounded-[1.75rem] shadow-soft sm:h-80 sm:w-64 cursor-pointer">
      <img
        src={photo}
        alt={product.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent transition-opacity duration-500 group-hover:from-navy/95"
      />
      <div className="absolute left-4 top-4 flex flex-col gap-1 items-start">
        <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent backdrop-blur-sm shadow-sm">
          {tag}
        </span>
        {product.isBestseller && (
          <span className="rounded-full bg-brand px-2.5 py-0.5 text-[9px] font-bold text-white shadow-sm flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Bestseller
          </span>
        )}
      </div>

      <figcaption className="absolute inset-x-0 bottom-0 p-5">
        {shopName && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 truncate">
            <Store className="w-3 h-3 shrink-0" />
            <span>{shopName}</span>
          </span>
        )}
        <span className="font-display text-lg font-bold tracking-tight text-white line-clamp-1">
          {product.name}
        </span>

        <div className="mt-1 flex items-center justify-between">
          {product.regularPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-base text-white">
                ₹{product.discountedPrice || product.regularPrice}
              </span>
              {product.discountedPrice && (
                <span className="text-xs text-white/50 line-through">
                  ₹{product.regularPrice}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[11px] font-medium text-white/60">Discover in app</span>
          )}

          <span className="text-[11px] font-bold text-brand group-hover:text-amber-300 transition-colors flex items-center gap-0.5 opacity-90 group-hover:opacity-100">
            View Menu <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </figcaption>
    </figure>
  );

  if (isDynamic) {
    return <Link to={`/shops/${product.shop.slug}`}>{content}</Link>;
  }

  return content;
}

function Row({ items, reverse = false }) {
  if (!items || items.length === 0) return null;
  /* each copy repeats the items so the loop is seamless on wide screens */
  const copy = items.length < 4 ? [...items, ...items, ...items, ...items] : [...items, ...items, ...items];
  return (
    <div className={`marquee-viewport py-3 ${reverse ? "marquee-reverse" : ""}`}>
      <div className="marquee-track gap-6 pr-6">
        <div className="flex gap-6">
          {copy.map((p, i) => (
            <Card key={`${p.name || p._id}-${i}`} product={p} />
          ))}
        </div>
        <div className="flex gap-6" aria-hidden="true">
          {copy.map((p, i) => (
            <Card key={`dup-${p.name || p._id}-${i}`} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Showcase() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedMenuItemsApi();
        if (res.data?.success && res.data.items?.length > 0) {
          setItems(res.data.items);
        }
      } catch (err) {
        // Fallback to static PRODUCTS
      }
    };
    fetchFeatured();
  }, []);

  const displayList = items.length > 0 ? items : PRODUCTS;
  const half = Math.ceil(displayList.length / 2);
  const row1 = displayList.slice(0, half);
  const row2 = displayList.slice(half);

  return (
    <section id="tastes" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <p className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-brand">
            <span aria-hidden="true" className="h-[2px] w-7 rounded-full bg-brand" /> The showcase
            <span aria-hidden="true" className="h-[2px] w-7 rounded-full bg-brand" />
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-navy sm:text-4xl lg:text-[2.8rem]">
            One App. A Whole World of <span className="text-brand">Mithai & Flavours.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-navy/60">
            A taste of what you can discover through the app — freshly sourced from Bagaha's top sweet shops and kitchens.
          </p>
        </div>
      </div>

      <div className="mt-12" data-reveal>
        <Row items={row1} />
        <Row items={row2.length > 0 ? row2 : row1} reverse />
      </div>

      <div className="mt-10 text-center" data-reveal>
        <Link
          to="/shops"
          className="group inline-flex items-center gap-2 font-display text-sm font-bold text-brand transition-colors hover:text-accent"
        >
          Explore all shops & live menus in Bagaha
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
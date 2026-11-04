import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  Bike,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import SEO from "../components/SEO";
import { getPublicShopsApi } from "../../admin/services/api";

const CATEGORIES = [
  "All",
  "Sweets & Mithai",
  "Namkeen & Snacks",
  "Bakery & Cakes",
  "Ice Cream & Desserts",
  "Fast Food",
  "Restaurant",
];

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchShops = async () => {
      setLoading(true);
      try {
        const res = await getPublicShopsApi({
          search: search || undefined,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
        });
        if (res.data?.success) {
          setShops(res.data.shops || []);
        }
      } catch (err) {
        console.error("Failed to load public shops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [selectedCategory]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getPublicShopsApi({
        search: search || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
      });
      if (res.data?.success) {
        setShops(res.data.shops || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7f1] text-navy">
      <SEO
        title="All Sweet Shops, Bakeries & Restaurants in Bagaha"
        description="Explore top verified sweet shops, bakeries and eateries in Bagaha, West Champaran. View live digital menus, prices, and order authentic Champaran Pedha on WhatsApp."
        keywords="shops in bagaha, sweet shops bagaha, champaran pedha shops, mishrajichamparnwale shops, prakash sweets bagaha, food delivery bagaha bihar"
        canonicalUrl="https://mishrajichamparnwale.com/shops"
      />
      <Navbar />

      <main className="pt-28 pb-20">
        {/* ─── DIRECTORY HERO ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy shadow-soft ring-1 ring-navy/5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            Hyperlocal Shops in Bagaha, West Champaran
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-navy tracking-tight max-w-3xl mx-auto">
            Discover Trusted Local Sweet Shops, Namkeen &amp; Bakeries
          </h1>
          <p className="mt-4 text-base sm:text-lg text-navy/70 max-w-2xl mx-auto leading-relaxed">
            Browse through authentic partner shops in Bagaha, explore their complete live menus, and
            order freshly prepared treats directly to your doorstep.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-xl mx-auto relative flex items-center bg-white rounded-2xl shadow-lift p-1.5 border border-navy/5"
          >
            <Search className="w-5 h-5 text-navy/40 ml-3.5 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sweets, namkeen or shop name in Bagaha..."
              className="w-full px-3 py-2.5 text-sm font-medium text-navy bg-transparent outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand to-accent text-white font-display font-bold text-xs shadow-glow shrink-0 hover:opacity-95 transition"
            >
              Search
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-6 pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-brand to-accent text-white shadow-glow"
                    : "bg-white text-navy/70 hover:bg-cream border border-navy/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ─── SHOPS CARDS GRID ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 rounded-full border-4 border-brand/20 border-t-brand animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-navy/50">Loading local shops...</p>
            </div>
          ) : shops.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-navy/5 max-w-lg mx-auto">
              <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-display font-bold text-xl text-navy">No Shops Found</h3>
              <p className="text-xs text-navy/50 mt-1">
                We couldn't find any shops matching "{search}". Try searching something else or switch category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {shops.map((shop) => (
                <div
                  key={shop._id}
                  className="bg-white rounded-[2rem] overflow-hidden border border-navy/5 shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover & Logo Header */}
                    <div className="relative h-48 w-full bg-navy overflow-hidden">
                      {shop.coverImage ? (
                        <img
                          src={shop.coverImage}
                          alt={shop.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-navy to-[#360307]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-brand text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {shop.category}
                        </span>
                        {shop.isFeatured && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-400 text-navy text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 fill-navy" /> Featured
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="absolute top-3 right-3">
                        {shop.isOpen ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                            Open
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-gray-600 text-white text-[10px] font-bold shadow-sm">
                            Closed
                          </span>
                        )}
                      </div>

                      {/* Logo Avatar hanging over cover bottom */}
                      <div className="absolute -bottom-5 left-5 w-16 h-16 rounded-2xl bg-[#320104] p-1 ring-4 ring-white shadow-md flex items-center justify-center overflow-hidden">
                        {shop.logo ? (
                          <img src={shop.logo} alt={shop.name} className="w-full h-full object-contain" />
                        ) : (
                          <Store className="w-6 h-6 text-brand" />
                        )}
                      </div>
                    </div>

                    {/* Shop Body */}
                    <div className="pt-8 px-6 pb-4">
                      <h3 className="font-display font-bold text-xl text-navy group-hover:text-brand transition-colors">
                        {shop.name}
                      </h3>

                      {shop.ownerName && (
                        <p className="text-xs text-navy/50 font-medium mt-0.5">
                          By {shop.ownerName}
                        </p>
                      )}

                      <p className="text-xs text-navy/70 line-clamp-2 mt-2 leading-relaxed">
                        {shop.shortDescription || shop.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-navy/60">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand" />
                          <span className="truncate max-w-[150px]">{shop.address}</span>
                        </span>
                        {shop.deliveryAvailable && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <Bike className="w-3.5 h-3.5" /> Delivery
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-6 pb-6 pt-2">
                    <Link
                      to={`/shops/${shop.slug}`}
                      className="w-full py-3 px-4 rounded-2xl bg-cream hover:bg-brand hover:text-white text-navy font-display font-bold text-xs flex items-center justify-center gap-2 transition-all border border-brand/20 group/btn"
                    >
                      <UtensilsCrossed className="w-4 h-4 text-brand group-hover/btn:text-white" />
                      <span>View Menu &amp; Order</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}


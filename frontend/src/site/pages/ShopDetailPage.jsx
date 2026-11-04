import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Phone,
  MessageCircle,
  FileText,
  MapPin,
  Clock,
  Sparkles,
  UtensilsCrossed,
  Flame,
  Star,
  CheckCircle2,
  Bike,
  ShoppingBag,
  ArrowLeft,
  Share2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import SEO from "../components/SEO";
import { getPublicShopBySlugApi } from "../../admin/services/api";

export default function ShopDetailPage() {
  const { slug } = useParams();
  const [shop, setShop] = useState(null);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchShopDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPublicShopBySlugApi(slug);
        if (res.data?.success) {
          setShop(res.data.shop);
          setMenuCategories(res.data.menuCategories || []);
        } else {
          setError("Shop details could not be found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load shop details.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [slug]);

  const CONTACT_PHONE = "7065985868";
  const CONTACT_WHATSAPP = "917065985868";
  const CONTACT_EMAIL = "nmenergyinnovation@gmail.com";

  // Construct WhatsApp order link
  const getWhatsAppOrderUrl = (item = null) => {
    const cleanNumber = CONTACT_WHATSAPP;
    let text = `Hello *${shop?.name || "Mishra Ji Champaran Wale"}*, I am viewing your shop on *Mishra Ji Champaran Wale* (mishrajichamparnwale.com).`;
    if (item) {
      text += `\n\nI want to order:\n• *${item.name}* (Price: ₹${item.discountedPrice || item.regularPrice})\n\nPlease share delivery / preparation details.`;
    } else {
      text += `\n\nI would like to enquire about placing an order. Please share available items & delivery time.`;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const allItems = menuCategories.flatMap((c) => c.items);
  const displayedCategories =
    selectedCategory === "All"
      ? menuCategories
      : menuCategories.filter((c) => c.name === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff7f1] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand/20 border-t-brand animate-spin" />
          <p className="mt-4 font-display font-medium text-navy/70 text-sm">
            Loading shop menu & details...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-[#fff7f1] flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h2 className="font-display font-bold text-2xl text-navy">Shop Not Found</h2>
          <p className="text-sm text-navy/60 mt-2 mb-6">
            {error || "This shop is currently inactive or may have moved."}
          </p>
          <Link
            to="/shops"
            className="px-5 py-2.5 rounded-2xl bg-brand text-white font-display font-bold text-sm shadow-glow"
          >
            Explore Other Shops in Bagaha
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const shopJsonLd = shop
    ? {
        "@context": "https://schema.org",
        "@type": "FastFoodRestaurant",
        name: `${shop.name} - Mishra Ji Champaran Wale`,
        description: shop.shortDescription || shop.description,
        image: shop.coverImage || shop.logo || "https://mishrajichamparnwale.com/images/logo.jpg",
        url: `https://mishrajichamparnwale.com/shops/${shop.slug}`,
        telephone: shop.whatsapp || shop.phone || "+917065985868",
        address: {
          "@type": "PostalAddress",
          streetAddress: shop.address || "Main Market",
          addressLocality: shop.city || "Bagaha",
          addressRegion: shop.state || "Bihar",
          postalCode: shop.pincode || "845101",
          addressCountry: "IN",
        },
        servesCuisine: [shop.category || "Sweets", "Champaran Pedha", "Indian Mithai"],
      }
    : null;

  return (
    <div className="min-h-screen bg-[#fff7f1] text-navy">
      <SEO
        title={shop ? `${shop.name} Bagaha — Menu, Photos & WhatsApp Order` : "Shop Details"}
        description={
          shop
            ? `${shop.name} in ${shop.city}, West Champaran. ${shop.shortDescription || shop.description?.slice(0, 150)} Explore digital menu, prices & order on WhatsApp.`
            : "Shop details on Mishra Ji Champaran Wale."
        }
        keywords={
          shop
            ? `${shop.name}, ${shop.name} bagaha, ${shop.category} bagaha, mishrajichamparnwale ${shop.name}, champaran pedha, sweets in bagaha`
            : "mishrajichamparnwale shops"
        }
        canonicalUrl={shop ? `https://mishrajichamparnwale.com/shops/${shop.slug}` : undefined}
        ogImage={shop?.coverImage || shop?.logo || "https://mishrajichamparnwale.com/images/logo.jpg"}
        jsonLd={shopJsonLd}
      />
      <Navbar />

      <main className="pt-24 pb-20">
        {/* ─── BREADCRUMB ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-xs text-navy/50 font-medium">
          <Link to="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shops" className="hover:text-brand">Shops</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-navy font-bold truncate max-w-[200px]">{shop.name}</span>
        </div>

        {/* ─── SHOP HERO COVER & PROFILE ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-navy text-white shadow-xl">
            {/* Cover photo or gradient backdrop */}
            <div className="relative h-60 sm:h-80 w-full overflow-hidden">
              {shop.coverImage ? (
                <img
                  src={shop.coverImage}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-navy via-[#1e0711] to-[#360307]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
            </div>

            {/* Profile Info Overlay */}
            <div className="relative -mt-20 p-6 sm:p-10 pt-0">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                {/* Logo & Shop Info */}
                <div className="flex items-start sm:items-end gap-5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#320104] p-1.5 ring-4 ring-white/10 shadow-2xl flex items-center justify-center shrink-0 overflow-hidden">
                    {shop.logo ? (
                      <img src={shop.logo} alt={shop.name} className="w-full h-full object-contain" />
                    ) : (
                      <UtensilsCrossed className="w-10 h-10 text-brand" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-brand text-white font-bold text-xs uppercase tracking-wider">
                        {shop.category}
                      </span>
                      {shop.isFeatured && (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-navy font-extrabold text-xs flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-navy" /> Featured Partner
                        </span>
                      )}
                      {shop.isOpen ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                          Open Now
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-300 text-xs font-bold">
                          Closed
                        </span>
                      )}
                    </div>

                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                      {shop.name}
                    </h1>

                    <p className="mt-2 text-white/75 text-sm sm:text-base max-w-2xl leading-relaxed">
                      {shop.shortDescription || shop.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/60">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand" />
                        {shop.address}, {shop.city}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand" />
                        {shop.openingTime} – {shop.closingTime} ({shop.weeklyOff})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href={getWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-display font-bold text-sm shadow-lg transition-transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Order</span>
                  </a>

                  <a
                    href={`tel:+91${CONTACT_PHONE}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-display font-bold text-sm backdrop-blur-sm transition-colors"
                  >
                    <Phone className="w-4 h-4 text-brand" />
                    <span>Call Shop (+91 70659 85868)</span>
                  </a>

                  {shop.menuPdf && (
                    <a
                      href={shop.menuPdf}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand to-accent text-white font-display font-bold text-sm shadow-glow transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download Menu PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SPECIAL OFFERS BANNER (IF AVAILABLE) ─── */}
        {shop.specialOffers?.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shop.specialOffers.map((offer, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl p-5 bg-gradient-to-br from-amber-500/10 via-brand/10 to-transparent border border-brand/20 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-accent text-white flex items-center justify-center font-extrabold text-sm shadow-glow shrink-0">
                    %
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                      {offer.discount || "Special Offer"}
                    </span>
                    <h3 className="font-display font-bold text-base text-navy mt-0.5">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-navy/70 mt-1">{offer.description}</p>
                    {offer.validTill && (
                      <span className="inline-block mt-2 text-[10px] text-navy/40 font-medium">
                        {offer.validTill}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── DYNAMIC MENU EXPLORER ─── */}
        <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
                Explore The Menu
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy mt-1">
                Delicious Treats from {shop.name}
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === "All"
                    ? "bg-gradient-to-r from-brand to-accent text-white shadow-glow"
                    : "bg-white text-navy/70 hover:bg-cream border border-navy/5"
                }`}
              >
                All Items ({allItems.length})
              </button>
              {menuCategories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === c.name
                      ? "bg-gradient-to-r from-brand to-accent text-white shadow-glow"
                      : "bg-white text-navy/70 hover:bg-cream border border-navy/5"
                  }`}
                >
                  {c.name} ({c.items.length})
                </button>
              ))}
            </div>
          </div>

          {/* Menu Sections by Category */}
          {displayedCategories.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-navy/5">
              <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="font-display font-bold text-lg text-navy">No Menu Items Listed</h4>
              <p className="text-xs text-navy/50 mt-1 max-w-sm mx-auto">
                Items will appear here as soon as the shop updates their menu.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {displayedCategories.map((categoryGroup) => (
                <div key={categoryGroup.name}>
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-navy">
                      {categoryGroup.name}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-navy/10 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryGroup.items.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-3xl p-5 border border-navy/5 shadow-soft hover:shadow-lift transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image */}
                          <div className="relative h-48 rounded-2xl overflow-hidden bg-cream mb-4 border border-navy/5">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-navy/30">
                                <UtensilsCrossed className="w-10 h-10 mb-1" />
                              </div>
                            )}

                            {/* Bestseller / Featured badges */}
                            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                              {item.isBestseller && (
                                <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                                  <Flame className="w-3 h-3 fill-white" /> Bestseller
                                </span>
                              )}
                              {item.isFeatured && (
                                <span className="px-2.5 py-1 rounded-full bg-amber-400 text-navy text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                                  <Star className="w-3 h-3 fill-navy" /> Special
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Item Name & Price */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h4 className="font-display font-bold text-navy text-lg leading-tight">
                              {item.name}
                            </h4>
                            <div className="text-right shrink-0">
                              <span className="font-display font-bold text-brand text-lg">
                                ₹{item.discountedPrice || item.regularPrice}
                              </span>
                              {item.discountedPrice && (
                                <div className="text-xs text-navy/40 line-through">
                                  ₹{item.regularPrice}
                                </div>
                              )}
                            </div>
                          </div>

                          {item.description && (
                            <p className="text-xs text-navy/60 line-clamp-3 leading-relaxed mb-4">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Order via WhatsApp for this item */}
                        <a
                          href={getWhatsAppOrderUrl(item)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 w-full py-2.5 px-4 rounded-xl bg-cream hover:bg-brand hover:text-white text-navy font-display font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-brand/20 group/btn"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-600 group-hover/btn:text-white" />
                          <span>Order on WhatsApp</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── GALLERY & CUSTOM SECTIONS ─── */}
        {shop.galleryImages?.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
            <h3 className="font-display font-bold text-2xl text-navy mb-6">
              Shop Gallery & Preparation
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {shop.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-sm border border-navy/5"
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── CUSTOM FIELDS & ADDRESS CARD ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-[2.5rem] bg-white p-6 sm:p-10 border border-navy/5 shadow-soft flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
                Location & Information
              </span>
              <h3 className="font-display font-bold text-2xl text-navy">
                Visit {shop.name} in Bagaha
              </h3>
              <p className="text-sm text-navy/70 leading-relaxed">
                {shop.address}, {shop.city}, {shop.state} - {shop.pincode}
              </p>

              {shop.specialInstructions && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Special Notice:</strong> {shop.specialInstructions}
                </div>
              )}

              {shop.customFields?.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {shop.customFields.map((f, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-cream border border-brand/10">
                      <div className="text-[10px] font-bold text-navy/50 uppercase">{f.label}</div>
                      <div className="text-xs font-bold text-navy mt-0.5">{f.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              {shop.mapUrl && (
                <a
                  href={shop.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-2xl bg-navy text-white text-xs font-bold text-center hover:bg-brand transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-brand" />
                  <span>Get Directions on Google Maps</span>
                </a>
              )}
              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-[#25D366] text-white text-xs font-bold text-center hover:bg-[#20ba59] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


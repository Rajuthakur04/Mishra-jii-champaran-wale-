import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Store,
  Upload,
  Image as ImageIcon,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Check,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import {
  createShopApi,
  getAdminShopByIdApi,
  updateShopApi,
  uploadFileApi,
  uploadMultipleFilesApi,
} from "../services/api";

const CATEGORY_OPTIONS = [
  "Sweets & Mithai",
  "Namkeen & Snacks",
  "Bakery & Cakes",
  "Ice Cream & Desserts",
  "Beverages & Shakes",
  "Fast Food",
  "Pure Veg Restaurant",
  "Dhaba & Meals",
  "Other",
];

export default function ShopForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Uploading state
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Basic
    name: "",
    slug: "",
    ownerName: "",
    category: "Sweets & Mithai",
    shortDescription: "",
    description: "",
    logo: "",
    coverImage: "",
    galleryImages: [],

    // Contact
    phone: "+91 70659 85868",
    whatsapp: "917065985868",
    email: "nmenergyinnovation@gmail.com",
    altPhone: "+91 70659 85868",

    // Address
    address: "",
    city: "Bagaha",
    state: "Bihar",
    pincode: "845101",
    mapUrl: "",

    // Business
    openingTime: "08:00 AM",
    closingTime: "10:00 PM",
    weeklyOff: "Open All 7 Days",
    isOpen: true,
    deliveryAvailable: true,
    takeawayAvailable: true,
    specialInstructions: "",

    // Customization
    isFeatured: false,
    isActive: true,
    menuPdf: "",
    customBanners: [],
    specialOffers: [],
    customSections: [],
    customFields: [],
  });

  useEffect(() => {
    if (isEdit) {
      const fetchShop = async () => {
        try {
          const res = await getAdminShopByIdApi(id);
          if (res.data?.success) {
            setFormData({
              ...res.data.shop,
              galleryImages: res.data.shop.galleryImages || [],
              customBanners: res.data.shop.customBanners || [],
              specialOffers: res.data.shop.specialOffers || [],
              customSections: res.data.shop.customSections || [],
              customFields: res.data.shop.customFields || [],
            });
          }
        } catch (err) {
          setError("Failed to fetch shop details: " + (err.response?.data?.message || err.message));
        } finally {
          setFetching(false);
        }
      };
      fetchShop();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ─── FILE UPLOAD HANDLERS ───
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await uploadFileApi(fd);
      if (res.data?.success) {
        setFormData((prev) => ({ ...prev, logo: res.data.url }));
      }
    } catch (err) {
      alert("Failed to upload logo: " + (err.response?.data?.message || err.message));
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await uploadFileApi(fd);
      if (res.data?.success) {
        setFormData((prev) => ({ ...prev, coverImage: res.data.url }));
      }
    } catch (err) {
      alert("Failed to upload cover image: " + (err.response?.data?.message || err.message));
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    try {
      const res = await uploadMultipleFilesApi(fd);
      if (res.data?.success) {
        setFormData((prev) => ({
          ...prev,
          galleryImages: [...prev.galleryImages, ...res.data.urls],
        }));
      }
    } catch (err) {
      alert("Failed to upload gallery images: " + (err.response?.data?.message || err.message));
    } finally {
      setUploadingGallery(false);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await uploadFileApi(fd);
      if (res.data?.success) {
        setFormData((prev) => ({ ...prev, menuPdf: res.data.url }));
      }
    } catch (err) {
      alert("Failed to upload PDF: " + (err.response?.data?.message || err.message));
    } finally {
      setUploadingPdf(false);
    }
  };

  // ─── DYNAMIC SUB-ITEMS HANDLERS ───
  const addBanner = () => {
    setFormData((prev) => ({
      ...prev,
      customBanners: [...prev.customBanners, { title: "", subtitle: "", image: "", link: "" }],
    }));
  };

  const updateBanner = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.customBanners];
      updated[index][field] = value;
      return { ...prev, customBanners: updated };
    });
  };

  const removeBanner = (index) => {
    setFormData((prev) => ({
      ...prev,
      customBanners: prev.customBanners.filter((_, i) => i !== index),
    }));
  };

  const addOffer = () => {
    setFormData((prev) => ({
      ...prev,
      specialOffers: [
        ...prev.specialOffers,
        { title: "", discount: "", description: "", validTill: "" },
      ],
    }));
  };

  const updateOffer = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.specialOffers];
      updated[index][field] = value;
      return { ...prev, specialOffers: updated };
    });
  };

  const removeOffer = (index) => {
    setFormData((prev) => ({
      ...prev,
      specialOffers: prev.specialOffers.filter((_, i) => i !== index),
    }));
  };

  const addCustomSection = () => {
    setFormData((prev) => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        { title: "", content: "", order: prev.customSections.length + 1, isVisible: true },
      ],
    }));
  };

  const updateCustomSection = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.customSections];
      updated[index][field] = value;
      return { ...prev, customSections: updated };
    });
  };

  const removeCustomSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== index),
    }));
  };

  const addCustomField = () => {
    setFormData((prev) => ({
      ...prev,
      customFields: [...prev.customFields, { label: "", value: "" }],
    }));
  };

  const updateCustomField = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.customFields];
      updated[index][field] = value;
      return { ...prev, customFields: updated };
    });
  };

  const removeCustomField = (index) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  // ─── SUBMIT HANDLER ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.name.trim()) {
      setError("Shop name is required.");
      setLoading(false);
      return;
    }
    if (!formData.phone.trim() || !formData.whatsapp.trim()) {
      setError("Phone number and WhatsApp number are required for order routing.");
      setLoading(false);
      return;
    }
    if (!formData.address.trim()) {
      setError("Complete shop address is required.");
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        const res = await updateShopApi(id, formData);
        if (res.data?.success) {
          setSuccess("Shop updated successfully!");
          setTimeout(() => navigate("/admin/shops"), 1200);
        }
      } else {
        const res = await createShopApi(formData);
        if (res.data?.success) {
          setSuccess("Shop created successfully! Redirecting to menu manager...");
          setTimeout(() => navigate(`/admin/shops/${res.data.shop._id}/menu`), 1200);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save shop. Check your input.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout title="Loading Shop...">
        <div className="py-20 text-center text-sm text-navy/50">Fetching shop details...</div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: "basic", label: "A. Basic Details" },
    { id: "contact", label: "B. Contact & Address" },
    { id: "business", label: "C. Business Hours & Ops" },
    { id: "customization", label: "D. Banners, Offers & PDF" },
  ];

  return (
    <AdminLayout
      title={isEdit ? `Edit Shop: ${formData.name}` : "Add New Shop"}
      subtitle={
        isEdit
          ? "Update details, upload photos, or customize dynamic sections"
          : "Register a new partner shop to display on public website"
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/admin/shops"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy/60 hover:text-navy"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Shops</span>
        </Link>

        {isEdit && (
          <Link
            to={`/admin/shops/${id}/menu`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-accent bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200"
          >
            <span>Manage Dynamic Menu →</span>
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── TABS HEADER ─── */}
        <div className="bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-navy text-white shadow-sm"
                  : "text-navy/60 hover:bg-gray-100 hover:text-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB 1: BASIC DETAILS ─── */}
        {activeTab === "basic" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-lg text-navy border-b border-gray-100 pb-3">
              Basic Shop Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Shop Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Prakash Sweets"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Shop Owner Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="e.g. Prakash Mishra"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Shop Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none bg-white font-medium"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Custom URL Slug (Optional)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="auto-generated-from-name"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none font-mono text-xs"
                />
                <span className="text-[10px] text-navy/40">
                  Public URL: mishrajichamparanwale.com/shops/
                  {formData.slug || "shop-name"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                Short Description (Card Summary)
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="e.g. Authentic Champaran Pedha, Rasgulla & Khoya Mithai from trusted Bagaha artisans."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                Complete Shop Description / Story
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell customers about the history, ingredients, and special sweets/namkeen of this shop..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
              />
            </div>

            {/* ── Visual Media Uploads ── */}
            <div className="border-t border-gray-100 pt-6 space-y-6">
              <h4 className="font-display font-bold text-base text-navy">Visual Branding & Photos</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-2">
                    Shop Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-cream border border-brand/20 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo preview" className="w-full h-full object-contain" />
                      ) : (
                        <Store className="w-8 h-8 text-brand/40" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        id="logo-upload"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-navy hover:bg-gray-50 cursor-pointer shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 text-brand" />
                        <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                      </label>
                      <input
                        type="text"
                        name="logo"
                        value={formData.logo}
                        onChange={handleChange}
                        placeholder="Or paste image URL"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-2">
                    Shop Main Cover Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                      {formData.coverImage ? (
                        <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        id="cover-upload"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-navy hover:bg-gray-50 cursor-pointer shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 text-brand" />
                        <span>{uploadingCover ? "Uploading..." : "Upload Cover"}</span>
                      </label>
                      <input
                        type="text"
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        placeholder="Or paste cover URL"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-2">
                  Shop Gallery Photos
                </label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {formData.galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-200 group">
                      <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            galleryImages: prev.galleryImages.filter((_, i) => i !== idx),
                          }))
                        }
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 hover:border-brand flex flex-col items-center justify-center p-2 text-center transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="gallery-upload"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                    <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-5 h-5 text-brand mb-1" />
                      <span className="text-[10px] font-bold text-navy/70">
                        {uploadingGallery ? "Uploading..." : "+ Add Photos"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: CONTACT & ADDRESS ─── */}
        {activeTab === "contact" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-lg text-navy border-b border-gray-100 pb-3">
              Shop Contact & Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Mobile Number (Calling) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 70659 85868"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  WhatsApp Number (For Direct Orders) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="917065985868"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
                <span className="text-[10px] text-navy/40">
                  Customers click WhatsApp Order button to send their orders directly to this number.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Shop Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nmenergyinnovation@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Alternative Contact Number
                </label>
                <input
                  type="text"
                  name="altPhone"
                  value={formData.altPhone}
                  onChange={handleChange}
                  placeholder="+91 70659 85868"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-6">
              <h4 className="font-display font-bold text-base text-navy">Shop Physical Address</h4>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Complete Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Station Road, Main Market, Bagaha - 1"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Google Maps Location Link
                </label>
                <input
                  type="text"
                  name="mapUrl"
                  value={formData.mapUrl}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: BUSINESS OPERATIONS ─── */}
        {activeTab === "business" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-lg text-navy border-b border-gray-100 pb-3">
              Business Hours & Operations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Opening Time
                </label>
                <input
                  type="text"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  placeholder="08:00 AM"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Closing Time
                </label>
                <input
                  type="text"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  placeholder="10:00 PM"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Weekly Off / Working Days
                </label>
                <input
                  type="text"
                  name="weeklyOff"
                  value={formData.weeklyOff}
                  onChange={handleChange}
                  placeholder="e.g. Open All 7 Days or Tuesday"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand outline-none"
                />
              </div>
            </div>

            {/* Operational Toggles */}
            <div className="border-t border-gray-100 pt-6">
              <h4 className="font-display font-bold text-base text-navy mb-4">Availability Toggles</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    name="isOpen"
                    checked={formData.isOpen}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-brand focus:ring-brand"
                  />
                  <div>
                    <div className="text-xs font-bold text-navy">Shop Currently Open</div>
                    <div className="text-[10px] text-navy/50">Show as Open on public page</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    name="deliveryAvailable"
                    checked={formData.deliveryAvailable}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-brand focus:ring-brand"
                  />
                  <div>
                    <div className="text-xs font-bold text-navy">Delivery Available</div>
                    <div className="text-[10px] text-navy/50">Show Doorstep Delivery badge</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    name="takeawayAvailable"
                    checked={formData.takeawayAvailable}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-brand focus:ring-brand"
                  />
                  <div>
                    <div className="text-xs font-bold text-navy">Takeaway / Pick-up</div>
                    <div className="text-[10px] text-navy/50">Allow store pick-up orders</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                Special Instructions or Order Notes
              </label>
              <input
                type="text"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                placeholder="e.g. Festival bulk orders must be booked 24h prior. Fresh batches prepared daily at 9am."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand outline-none"
              />
            </div>
          </div>
        )}

        {/* ─── TAB 4: CUSTOMIZATION & OFFERS ─── */}
        {activeTab === "customization" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
            <h3 className="font-display font-bold text-lg text-navy border-b border-gray-100 pb-3">
              Shop Customization, Banners & PDF Menu
            </h3>

            {/* Visibility & Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-amber-200 bg-amber-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-brand focus:ring-brand"
                />
                <div>
                  <div className="text-xs font-bold text-navy">Featured Partner Shop</div>
                  <div className="text-[10px] text-navy/50">Show prominently on homepage banner & showcase</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-brand focus:ring-brand"
                />
                <div>
                  <div className="text-xs font-bold text-navy">Publish to Website (Active)</div>
                  <div className="text-[10px] text-navy/50">Uncheck to temporarily hide shop from customers</div>
                </div>
              </label>
            </div>

            {/* Menu PDF Upload */}
            <div className="border border-brand/20 bg-cream/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand" />
                  <h4 className="font-display font-bold text-sm text-navy">Menu PDF Document</h4>
                </div>
                {formData.menuPdf && (
                  <a
                    href={formData.menuPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    View Current PDF
                  </a>
                )}
              </div>
              <p className="text-xs text-navy/60 mb-3">
                Upload the shop's complete printable menu card in PDF format. Customers can download it directly.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="application/pdf"
                  id="pdf-upload"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white font-bold text-xs shadow-sm cursor-pointer hover:bg-accent"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingPdf ? "Uploading PDF..." : "Upload Menu PDF"}</span>
                </label>
                <input
                  type="text"
                  name="menuPdf"
                  value={formData.menuPdf}
                  onChange={handleChange}
                  placeholder="Or paste PDF URL"
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white outline-none"
                />
              </div>
            </div>

            {/* Special Offers Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-base text-navy">Special Offers & Deals</h4>
                  <p className="text-xs text-navy/50">Discounts and festive offers displayed on shop page</p>
                </div>
                <button
                  type="button"
                  onClick={addOffer}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-navy hover:bg-gray-50"
                >
                  <Plus className="w-3.5 h-3.5 text-brand" /> Add Offer
                </button>
              </div>

              {formData.specialOffers.map((offer, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="Offer Title (e.g. Festive Special)"
                      value={offer.title}
                      onChange={(e) => updateOffer(idx, "title", e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Discount Tag (e.g. 10% OFF)"
                      value={offer.discount}
                      onChange={(e) => updateOffer(idx, "discount", e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white font-bold text-brand"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={offer.description}
                      onChange={(e) => updateOffer(idx, "description", e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white sm:col-span-2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOffer(idx)}
                    className="p-1.5 text-navy/40 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-base text-navy">Custom Content Sections</h4>
                  <p className="text-xs text-navy/50">Extra custom sections for story, awards, hygiene standards</p>
                </div>
                <button
                  type="button"
                  onClick={addCustomSection}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-navy hover:bg-gray-50"
                >
                  <Plus className="w-3.5 h-3.5 text-brand" /> Add Section
                </button>
              </div>

              {formData.customSections.map((sec, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Section Heading"
                      value={sec.title}
                      onChange={(e) => updateCustomSection(idx, "title", e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomSection(idx)}
                      className="p-1.5 text-navy/40 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Section Content"
                    value={sec.content}
                    onChange={(e) => updateCustomSection(idx, "content", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                </div>
              ))}
            </div>

            {/* Dynamic Custom Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-base text-navy">Custom Key-Value Fields</h4>
                  <p className="text-xs text-navy/50">Add any custom detail (e.g. FSSAI No, Established Year)</p>
                </div>
                <button
                  type="button"
                  onClick={addCustomField}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-navy hover:bg-gray-50"
                >
                  <Plus className="w-3.5 h-3.5 text-brand" /> Add Field
                </button>
              </div>

              {formData.customFields.map((field, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Label (e.g. FSSAI License)"
                    value={field.label}
                    onChange={(e) => updateCustomField(idx, "label", e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 20421000000123)"
                    value={field.value}
                    onChange={(e) => updateCustomField(idx, "value", e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomField(idx)}
                    className="p-1.5 text-navy/40 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ACTION BUTTONS ─── */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <Link
            to="/admin/shops"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-navy hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand to-accent hover:opacity-95 text-white font-display font-bold text-sm shadow-glow flex items-center gap-2 transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEdit ? "Update Shop Details" : "Save & Proceed to Menu"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}


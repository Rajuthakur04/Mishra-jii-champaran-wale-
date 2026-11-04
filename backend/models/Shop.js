import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    // A. Basic Shop Details
    name: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    ownerName: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Shop category is required"],
      trim: true,
      default: "Sweets & Mithai",
    },
    description: {
      type: String,
      default: "",
    },
    shortDescription: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    galleryImages: {
      type: [String],
      default: [],
    },

    // B. Contact Details
    phone: {
      type: String,
      required: [true, "Primary phone number is required"],
      trim: true,
    },
    whatsapp: {
      type: String,
      required: [true, "WhatsApp number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    altPhone: {
      type: String,
      trim: true,
      default: "",
    },

    // C. Shop Address
    address: {
      type: String,
      required: [true, "Shop address is required"],
      trim: true,
    },
    city: {
      type: String,
      default: "Bagaha",
      trim: true,
    },
    state: {
      type: String,
      default: "Bihar",
      trim: true,
    },
    pincode: {
      type: String,
      default: "845101",
      trim: true,
    },
    mapUrl: {
      type: String,
      default: "",
    },

    // D. Business Details
    openingTime: {
      type: String,
      default: "08:00 AM",
    },
    closingTime: {
      type: String,
      default: "10:00 PM",
    },
    weeklyOff: {
      type: String,
      default: "Open All 7 Days",
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    deliveryAvailable: {
      type: Boolean,
      default: true,
    },
    takeawayAvailable: {
      type: Boolean,
      default: true,
    },
    specialInstructions: {
      type: String,
      default: "",
    },

    // E. Customization & Display Controls
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    menuPdf: {
      type: String,
      default: "",
    },
    customBanners: [
      {
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        image: { type: String, default: "" },
        link: { type: String, default: "" },
      },
    ],
    specialOffers: [
      {
        title: { type: String, default: "" },
        discount: { type: String, default: "" },
        description: { type: String, default: "" },
        validTill: { type: String, default: "" },
      },
    ],
    customSections: [
      {
        title: { type: String, default: "" },
        content: { type: String, default: "" },
        order: { type: Number, default: 0 },
        isVisible: { type: Boolean, default: true },
      },
    ],
    customFields: [
      {
        label: { type: String, default: "" },
        value: { type: String, default: "" },
      },
    ],
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for item count
shopSchema.virtual("menuItems", {
  ref: "MenuItem",
  localField: "_id",
  foreignField: "shop",
});

export const Shop = mongoose.model("Shop", shopSchema);


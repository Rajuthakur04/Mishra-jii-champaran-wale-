import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "./models/Admin.js";
import { Shop } from "./models/Shop.js";
import { MenuItem } from "./models/MenuItem.js";

dotenv.config();

const seed = async (exitOnComplete = false) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mishrajichamparan");
    console.log("[Seeding]: Connected to MongoDB...");

    // 1. Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL || "nmenergyinnovation@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      admin = new Admin({
        name: "Mishra Ji Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      await admin.save();
      console.log(`[Admin Seeded]: Email: ${adminEmail} | Password: ${adminPassword}`);
    } else {
      console.log(`[Admin Exists]: ${adminEmail}`);
    }

    // 2. Check if initial shop exists, if not seed Prakash Sweets
    let shop = await Shop.findOne({ slug: "prakash-sweets" });
    if (!shop) {
      shop = new Shop({
        name: "Prakash Sweets",
        slug: "prakash-sweets",
        ownerName: "Prakash Mishra",
        category: "Sweets & Mithai",
        shortDescription: "Authentic Champaran Pedha, Rasgulla & Khoya Mithai from trusted Bagaha artisans.",
        description:
          "Bagaha's most trusted heritage sweet shop serving pure desi ghee Champaran Pedha, hot Gulab Jamun, crunchy Jalebi, and mouth-watering namkeen since 1985. Every delicacy is prepared with fresh local ingredients and traditional recipes.",
        logo: "/images/logo-crest.png",
        coverImage: "/images/champaran-pedha.jpg",
        galleryImages: [
          "/images/champaran-pedha.jpg",
          "/images/logo.jpg",
        ],
        phone: "+91 70659 85868",
        whatsapp: "917065985868",
        email: "nmenergyinnovation@gmail.com",
        altPhone: "+91 70659 85868",
        address: "Station Road, Main Market, Bagaha - 1",
        city: "Bagaha",
        state: "Bihar",
        pincode: "845101",
        mapUrl: "https://maps.google.com/?q=Bagaha+Bihar",
        openingTime: "08:00 AM",
        closingTime: "10:00 PM",
        weeklyOff: "Open All 7 Days",
        isOpen: true,
        deliveryAvailable: true,
        takeawayAvailable: true,
        specialInstructions: "Fresh morning batches ready by 9:00 AM. Festival bulk orders available on WhatsApp.",
        isFeatured: true,
        isActive: true,
        customBanners: [
          {
            title: "Champaran Special Pedha",
            subtitle: "100% Pure Buffalo Milk Khoya",
            image: "/images/champaran-pedha.jpg",
            link: "#menu",
          },
        ],
        specialOffers: [
          {
            title: "Festive Box Discount",
            discount: "10% OFF",
            description: "On all Sweet boxes above ₹500",
            validTill: "Valid this week",
          },
        ],
        customSections: [
          {
            title: "About Our Pedha",
            content: "Made with authentic slow-caramelized milk khoya from West Champaran dairy farms.",
            order: 1,
            isVisible: true,
          },
        ],
        customFields: [
          { label: "FSSAI License", value: "20421000000123" },
          { label: "Establishment Year", value: "1985" },
        ],
      });

      await shop.save();
      console.log("[Shop Seeded]: Prakash Sweets created!");

      // 3. Seed Menu Items for Prakash Sweets
      const sampleMenu = [
        {
          shop: shop._id,
          name: "Champaran Special Pedha (1 Kg)",
          image: "/images/champaran-pedha.jpg",
          description: "Signature slow-cooked pure khoya pedha with rich cardamom flavor.",
          regularPrice: 480,
          discountedPrice: 440,
          category: "Special Menu",
          isAvailable: true,
          isFeatured: true,
          isBestseller: true,
          order: 1,
        },
        {
          shop: shop._id,
          name: "Shahi Gulab Jamun (1 Kg)",
          image: "/images/champaran-pedha.jpg",
          description: "Melt-in-mouth soft khoya gulab jamun dipped in aromatic saffron syrup.",
          regularPrice: 360,
          discountedPrice: 320,
          category: "Mithai",
          isAvailable: true,
          isFeatured: false,
          isBestseller: true,
          order: 2,
        },
        {
          shop: shop._id,
          name: "Kaju Katli Diamond Box (500g)",
          image: "/images/champaran-pedha.jpg",
          description: "Premium cashew fudge prepared with pure Goan cashews and edible silver leaf.",
          regularPrice: 550,
          discountedPrice: 499,
          category: "Special Menu",
          isAvailable: true,
          isFeatured: true,
          isBestseller: false,
          order: 3,
        },
        {
          shop: shop._id,
          name: "Crispy Samosa Singara (4 Pcs)",
          image: "/images/champaran-pedha.jpg",
          description: "Spiced potato & peanut filled crispy crust, served with sweet & spicy chutneys.",
          regularPrice: 60,
          discountedPrice: null,
          category: "Snacks",
          isAvailable: true,
          isFeatured: false,
          isBestseller: true,
          order: 4,
        },
        {
          shop: shop._id,
          name: "Royal Rasgulla (12 Pcs Can)",
          image: "/images/champaran-pedha.jpg",
          description: "Spongy, juicy chhena rasgullas prepared daily in fresh light syrup.",
          regularPrice: 280,
          discountedPrice: 250,
          category: "Mithai",
          isAvailable: true,
          isFeatured: false,
          isBestseller: false,
          order: 5,
        },
        {
          shop: shop._id,
          name: "Special Champaran Festival Combo Box",
          image: "/images/champaran-pedha.jpg",
          description: "Assorted pack of Pedha, Kaju Katli, Besan Laddu and Namkeen (1.2 Kg total).",
          regularPrice: 850,
          discountedPrice: 750,
          category: "Combos",
          isAvailable: true,
          isFeatured: true,
          isBestseller: true,
          order: 6,
        },
      ];

      await MenuItem.insertMany(sampleMenu);
      console.log(`[Menu Seeded]: ${sampleMenu.length} items added for Prakash Sweets!`);
    } else {
      console.log("[Shop Exists]: Prakash Sweets is already seeded.");
    }

    console.log("[Seeding Complete Successfully]");
    if (exitOnComplete) process.exit(0);
    return true;
  } catch (error) {
    console.error("[Seeding Error]:", error);
    if (exitOnComplete) process.exit(1);
    throw error;
  }
};

const isDirectRun = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("seed.js");
if (isDirectRun) {
  seed(true);
}

export { seed as seedData };


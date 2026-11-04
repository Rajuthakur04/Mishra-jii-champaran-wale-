/**
 * ════════════════════════════════════════════════════════════════════
 *  MISHRA JI CHAMPARAN WALE — SINGLE SITE CONFIGURATION FILE
 * ════════════════════════════════════════════════════════════════════
 *  Everything the website says about the business lives here.
 *
 *  ① DOWNLOAD LINKS (IMPORTANT)
 *     No Play Store / App Store / APK URL was found in the workspace,
 *     so the fields below are intentionally EMPTY — the site never
 *     invents links. Paste the real URLs here and every button,
 *     including the QR block, updates automatically:
 *
 *       androidUrl : Play Store listing URL of the Flutter app
 *       iosUrl     : App Store URL — ONLY if an iOS build exists
 *       apkUrl     : optional direct APK link (fallback for Android)
 *       qrImage    : optional QR image that encodes a VERIFIED link
 *
 *     While a URL is empty, its button opens a polite "Get the app"
 *     dialog offering the verified phone / WhatsApp / email channels.
 *
 *  ② REAL APP SCREENSHOTS
 *     Each entry in SCREENS has an `image` field. Paste a real Flutter
 *     screenshot (portrait, e.g. 1080×2340, in /public or a URL) and
 *     the phone mockups will show it instead of the brand artwork.
 *     Until then, phones show photo-led brand showcase art — no fake
 *     app UI, no invented features.
 * ════════════════════════════════════════════════════════════════════
 */

export const BUSINESS = {
  name: "Mishra Ji Champaran Wale",
  shortName: "Mishra Ji",
  domain: "mishrajichamparnwale.com",
  phone: "+91 70659 85868",
  phoneHref: "tel:+917065985868",
  whatsappHref: "https://wa.me/917065985868",
  email: "nmenergyinnovation@gmail.com",
  emailHref: "mailto:nmenergyinnovation@gmail.com",
  address: "Bagaha, West Champaran, Bihar, India — 845101",
  city: "Bagaha",
  partner: {
    name: "Prakash Sweets",
    location: "Railway Dhala, Bagaha",
  },
};

export const DOWNLOADS = {
  androidUrl: "", // ← paste verified Play Store URL here
  iosUrl: "", // ← paste verified App Store URL here (only if iOS app exists)
  apkUrl: "", // ← optional verified direct APK link
  qrImage: "", // ← optional QR image of a verified download URL
};

/* Pexels helper — free stock photography, cropped per usage. */
const px = (id, w, h) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const IMAGES = {
  mithaiTray: px(8887052, 800, 1200),
  sweetsBowls: px(8887025, 800, 1200),
  shopDisplayTall: px(38524183, 800, 1200),
  shopDisplayWide: px(30251968, 1280, 860),
  ladduRustic: px(39959317, 800, 1200),
  ladduClose: px(8659010, 700, 880),
  gulabJamun: px(29259167, 700, 880),
  gulabJamunTall: px(15014918, 800, 1200),
  jalebi: px(39193446, 700, 880),
  jalebiTall: px(39193443, 800, 1200),
  kajuKatli: px(10514163, 700, 880),
  rasgulla: px(8788869, 700, 880),
  barfi: px(38883078, 700, 880),
  kulfi: px(32676071, 700, 880),
  iceCream: px(8104733, 700, 880),
  namkeen: px(9557672, 700, 880),
  pedha: "images/champaran-pedha.jpg",
};

/**
 * Phone-mockup screens. Set `image` to a real screenshot to replace
 * the artwork. `kind: "brand"` renders the navy brand screen;
 * `kind: "photo"` renders a full-bleed photo showcase screen.
 */
export const SCREENS = {
  home: {
    image: "",
    kind: "photo",
    photo: IMAGES.mithaiTray,
    chip: "Fresh from local shops",
    title: "Aaj kya meetha ho?",
    subtitle: "Sweets · Namkeen · Ice Cream",
    categories: ["Sweets", "Namkeen", "Ice Cream"],
    alt: "Mishra Ji app showcase — sweets from local shops in Bagaha",
  },
  laddu: {
    image: "",
    kind: "photo",
    photo: IMAGES.ladduRustic,
    chip: "Local favourite",
    title: "Motichoor Laddu",
    subtitle: "Prakash Sweets · Railway Dhala",
    alt: "Mishra Ji app showcase — Motichoor Laddu",
  },
  shops: {
    image: "",
    kind: "photo",
    photo: IMAGES.shopDisplayTall,
    chip: "Partner shops",
    title: "Your local mithai counter",
    subtitle: "Now on your phone",
    alt: "Mishra Ji app showcase — local sweet shop counter",
  },
  explore: {
    image: "",
    kind: "photo",
    photo: IMAGES.sweetsBowls,
    chip: "Explore the app",
    title: "Sweets, snacks & more",
    subtitle: "Discover Bagaha's flavours",
    alt: "Mishra Ji app showcase — exploring sweets and snacks",
  },
  jalebi: {
    image: "",
    kind: "photo",
    photo: IMAGES.jalebiTall,
    chip: "Order in the app",
    title: "Garama-garam Jalebi",
    subtitle: "From your favourite shops",
    alt: "Mishra Ji app showcase — jalebi from local shops",
  },
  jamun: {
    image: "",
    kind: "photo",
    photo: IMAGES.gulabJamunTall,
    chip: "Sweet cravings",
    title: "Gulab Jamun",
    subtitle: "Delivered to your doorstep",
    alt: "Mishra Ji app showcase — Gulab Jamun",
  },
  brand: {
    image: "",
    kind: "brand",
    alt: "Mishra Ji Champaran Wale app — brand screen",
  },
  delivery: {
    image: "",
    kind: "delivery",
    alt: "Mishra Ji app showcase — doorstep delivery in Bagaha",
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

/* Only capabilities stated by the business itself:
   discover products from local shops, order through the app,
   sourcing from partner shops, doorstep delivery in Bagaha. */
export const FEATURES = [
  {
    id: "discover",
    icon: "Search",
    title: "Discover local favourites",
    text: "Browse sweets, namkeen and ice creams from your favourite local shops in Bagaha — all inside one app.",
    photos: [IMAGES.ladduClose, IMAGES.jalebi, IMAGES.kulfi],
    span: "wide",
  },
  {
    id: "shops",
    icon: "Store",
    title: "From trusted local shops",
    text: "Products are sourced directly from partner shops like Prakash Sweets, Railway Dhala.",
    photo: IMAGES.shopDisplayTall,
    span: "tall",
  },
  {
    id: "order",
    icon: "Smartphone",
    title: "Order in a few taps",
    text: "Pick your treats and place the order right through the Mishra Ji app. We handle the rest.",
    span: "std",
  },
  {
    id: "delivery",
    icon: "Bike",
    title: "Doorstep delivery",
    text: "We collect your order from the shop and bring it straight to your door in Bagaha.",
    span: "std",
  },
  {
    id: "local",
    icon: "MapPin",
    title: "Made for Bagaha",
    text: "A hyperlocal app built around the taste of West Champaran — by people who know it.",
    span: "std",
  },
];

export const STEPS = [
  {
    icon: "Smartphone",
    title: "Open the Mishra Ji app",
    text: "Launch the Mishra Ji Champaran Wale application on your phone — your local sweet shelf is ready.",
    screen: "brand",
  },
  {
    icon: "Search",
    title: "Explore sweets & ice creams",
    text: "Browse the sweets, namkeen, ice creams and kulfi available from local shops around you.",
    screen: "explore",
  },
  {
    icon: "Store",
    title: "Pick from local shops",
    text: "Choose your favourites from partner shops like Prakash Sweets, Railway Dhala, Bagaha.",
    screen: "shops",
  },
  {
    icon: "ShoppingBag",
    title: "Place your order in the app",
    text: "Confirm your treats through the app. We source them directly from the partner shop.",
    screen: "jalebi",
  },
  {
    icon: "Bike",
    title: "Enjoy doorstep delivery",
    text: "Sit back — your box of fresh favourites arrives at your doorstep in Bagaha.",
    screen: "delivery",
  },
];

/* Marketing showcase only — no prices, no cart, no checkout. */
export const PRODUCTS = [
  { name: "Champaran Pedha", tag: "Signature Mithai", photo: IMAGES.pedha },
  { name: "Shahi Rasgulla", tag: "Mithai", photo: IMAGES.rasgulla },
  { name: "Gulab Jamun", tag: "Mithai", photo: IMAGES.gulabJamun },
  { name: "Kaju Katli", tag: "Mithai", photo: IMAGES.kajuKatli },
  { name: "Motichoor Laddu", tag: "Mithai", photo: IMAGES.ladduClose },
  { name: "Barfi", tag: "Mithai", photo: IMAGES.barfi },
  { name: "Jalebi", tag: "Mithai", photo: IMAGES.jalebi },
  { name: "Ice Cream", tag: "Frozen Treat", photo: IMAGES.iceCream },
  { name: "Kulfi", tag: "Frozen Treat", photo: IMAGES.kulfi },
  { name: "Namkeen", tag: "Snacks", photo: IMAGES.namkeen },
];

export const TICKER_ITEMS = [
  "Champaran Pedha",
  "Shahi Rasgulla",
  "Gulab Jamun",
  "Kaju Katli",
  "Motichoor Laddu",
  "Barfi",
  "Jalebi",
  "Ice Cream",
  "Kulfi",
  "Namkeen",
  "मिठाई · नमकीन · आइसक्रीम",
];

export const BENEFITS = [
  {
    icon: "MapPin",
    title: "Local at heart",
    text: "Built in Bagaha, for Bagaha — a hyperlocal app that knows West Champaran's taste.",
  },
  {
    icon: "Store",
    title: "Shop-fresh sourcing",
    text: "Your treats are sourced directly from partner shops, not warehouses.",
  },
  {
    icon: "Sparkles",
    title: "One app, every craving",
    text: "Sweets, desserts, namkeen and ice creams — together in one place.",
  },
  {
    icon: "Bike",
    title: "Doorstep convenience",
    text: "Order from your phone and let us bring the sweet shop to your door.",
  },
];

export const FAQS = [
  {
    q: "What is Mishra Ji Champaran Wale?",
    a: "Mishra Ji Champaran Wale is a hyperlocal delivery platform based in Bagaha, West Champaran. Through our mobile app, customers discover sweets, desserts, namkeen and ice creams from trusted local shops. We act as the delivery bridge — sourcing products directly from partner shops and bringing them to your doorstep.",
  },
  {
    q: "How does the app work?",
    a: "Open the app, explore the sweets, ice creams and snacks available from local shops, and place your order. We source your products directly from the partner shop and deliver them to your address. The complete ordering experience happens inside the Mishra Ji mobile application.",
  },
  {
    q: "Where is the service based?",
    a: "We are based in Bagaha, West Champaran, Bihar, India — 845101. The app is built around Bagaha's local shops and customers. For questions about your area, call us at +91 70659 85868.",
  },
  {
    q: "Which products can I discover on the app?",
    a: "You can discover Indian sweets like Champaran Pedha, Shahi Rasgulla, Gulab Jamun, Kaju Katli, Motichoor Laddu, Barfi and Jalebi, along with ice creams, kulfi and namkeen. Availability depends on the partner shops at the time you browse.",
  },
  {
    q: "Which local shop is featured?",
    a: "Our featured partner is Prakash Sweets, located at Railway Dhala, Bagaha. We connect customers with trusted local shops like theirs and deliver their products through the app.",
  },
  {
    q: "How can I download the app?",
    a: "Use the Download buttons on this page. If a store link isn't available on this page yet, contact us at +91 70659 85868 or nmenergyinnovation@gmail.com and we will share the official app with you directly.",
  },
];
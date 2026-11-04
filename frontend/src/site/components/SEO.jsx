import { useEffect } from "react";

/**
 * Reusable Dynamic SEO Component
 * Automatically synchronizes document title, meta tags, OpenGraph, and canonical links.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://mishrajichamparnwale.com/images/logo.jpg",
  noIndex = false,
  jsonLd = null,
}) {
  const fullTitle = title
    ? `${title} | Mishra Ji Champaran Wale (mishrajichamparnwale.com)`
    : "Mishra Ji Champaran Wale — Official Website | Best Champaran Pedha & Sweets in Bagaha";

  const fullDescription =
    description ||
    "Official website of Mishra Ji Champaran Wale (mishrajichamparnwale.com). Discover & order authentic Champaran Pedha, traditional Indian sweets, namkeen and ice cream from trusted local shops in Bagaha, Bihar.";

  const fullKeywords =
    keywords ||
    "mishrajichamparnwale.com, mishrajichamparnwale, mishra ji champaran wale, mishra ji, champaran wale, champaran pedha, best sweets in bagaha, bagaha sweets delivery, prakash sweets bagaha";

  useEffect(() => {
    // 1. Update document title
    document.title = fullTitle;

    // 2. Helper to set or create meta tags
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", fullDescription);
    setMeta("name", "keywords", fullKeywords);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setMeta("name", "googlebot", noIndex ? "noindex, nofollow" : "index, follow");

    // OpenGraph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", fullDescription);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:url", canonicalUrl || window.location.href);

    // Twitter
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", fullDescription);
    setMeta("name", "twitter:image", ogImage);

    // Canonical link
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl || window.location.href);

    // JSON-LD Schema (if provided)
    let scriptTag = document.getElementById("dynamic-page-schema");
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "dynamic-page-schema";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, fullDescription, fullKeywords, canonicalUrl, ogImage, noIndex, jsonLd]);

  return null;
}


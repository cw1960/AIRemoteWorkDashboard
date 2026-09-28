import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Deploy previews must not be indexed; Netlify sets CONTEXT=production only
  // for production deploys.
  const isProduction = process.env.CONTEXT
    ? process.env.CONTEXT === "production"
    : process.env.NODE_ENV === "production";

  return {
    rules: isProduction
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
  };
}

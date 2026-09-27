import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/boutique", destination: "/shop", permanent: false },
      { source: "/produits/:slug", destination: "/product/:slug", permanent: false },
      { source: "/panier", destination: "/cart", permanent: false },
      { source: "/devis", destination: "/quote", permanent: false },
    ];
  },
};

export default nextConfig;

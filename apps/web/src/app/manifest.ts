import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "N5Deal — M&A Marketplace",
    short_name: "N5Deal",
    description: "Structured deal flow for buyers and sellers of M&A and financial assets.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1220",
    theme_color: "#0a1220",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}

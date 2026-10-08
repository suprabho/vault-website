import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Vault",
    short_name: "The Vault",
    description:
      "A private network for the people shaping and navigating financial crime, regulation and risk across digital assets.",
    start_url: "/",
    display: "standalone",
    background_color: "#010016",
    theme_color: "#010016",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow HTTPS dev tunnels (e.g. cloudflared) to load client JS and HMR.
  allowedDevOrigins: ["*.trycloudflare.com", "*.ngrok-free.app", "*.ngrok.io"],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.trycloudflare.com",
        "*.ngrok-free.app",
        "*.ngrok.io",
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;

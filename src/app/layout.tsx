import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartCountLoader } from "@/components/cart-count-loader";
import { CartCountProvider } from "@/components/cart-count-provider";
import { SetupBanner } from "@/components/setup-banner";
import "./globals.css";

const MobileNav = dynamic(
  () => import("@/components/mobile-nav").then((mod) => mod.MobileNav),
  { ssr: true },
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rokn",
    template: "%s | Rokn",
  },
  description: "Modern headless ecommerce powered by Shopify and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="" />
      </head>
      <body className="flex min-h-full flex-col bg-white text-foreground">
        <CartCountProvider initialCount={0}>
          <CartCountLoader />
          <SetupBanner />
          {children}
          <MobileNav />
        </CartCountProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

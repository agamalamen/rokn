import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartCountLoader } from "@/components/cart-count-loader";
import { CartCountProvider } from "@/components/cart-count-provider";
import { MobileNav } from "@/components/mobile-nav";
import { SetupBanner } from "@/components/setup-banner";
import "./globals.css";

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

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const initialPathname = headersList.get("x-pathname") ?? "/";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="" />
      </head>
      <body className="bg-background text-foreground">
        <CartCountProvider initialCount={0}>
          <div className="max-sm:flex max-sm:h-dvh max-sm:flex-col max-sm:overflow-hidden">
            <div
              id="app-scroll"
              className="max-sm:min-h-0 max-sm:flex-1 max-sm:overflow-y-auto"
            >
              <CartCountLoader />
              <SetupBanner />
              {children}
            </div>
            <MobileNav initialPathname={initialPathname} />
          </div>
        </CartCountProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

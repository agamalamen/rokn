import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fetchCart } from "@/actions/cart";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = await fetchCart();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-foreground">
        <CartCountProvider initialCount={cart?.totalQuantity ?? 0}>
          <SetupBanner />
          {children}
          <MobileNav />
        </CartCountProvider>
      </body>
    </html>
  );
}

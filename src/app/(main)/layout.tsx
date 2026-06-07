import { Header } from "@/components/header";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-nav">{children}</main>
    </>
  );
}

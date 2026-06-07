import Link from "next/link";
import { fetchCart } from "@/actions/cart";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export async function Header() {
  const cart = await fetchCart();
  const itemCount = cart?.totalQuantity ?? 0;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight text-stone-900">
          Rokn
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-900 transition-colors hover:border-stone-300 hover:bg-stone-50"
        >
          Cart
          {itemCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1.5 text-xs font-semibold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

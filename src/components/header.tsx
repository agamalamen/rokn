import Link from "next/link";
import { fetchCart } from "@/actions/cart";
import { HeaderCartLink } from "@/components/header-cart-link";
import { HeaderSearch } from "@/components/header-search";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/collections", label: "Collections" },
];

export async function Header() {
  const cart = await fetchCart();
  const itemCount = cart?.totalQuantity ?? 0;

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:gap-4 sm:py-0 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-left sm:text-4xl"
        >
          Rokn
        </Link>

        <HeaderSearch />

        <nav className="ml-auto hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <HeaderCartLink itemCount={itemCount} />
      </div>
    </header>
  );
}

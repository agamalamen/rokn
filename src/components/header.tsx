import Link from "next/link";
import { fetchCart } from "@/actions/cart";
import { HeaderCartLink } from "@/components/header-cart-link";
import { HeaderProfileLink } from "@/components/header-profile-link";
import { HeaderSearch } from "@/components/header-search";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/collections", label: "Collections" },
];

export async function Header() {
  const cart = await fetchCart();
  const itemCount = cart?.totalQuantity ?? 0;

  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight text-accent sm:text-4xl"
          >
            Rokn
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden items-center gap-6 sm:flex">
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
            <HeaderProfileLink />
          </div>
        </div>

        <HeaderSearch />
      </div>
    </header>
  );
}

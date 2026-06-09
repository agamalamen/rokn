import Link from "next/link";
import { HeaderCartLink } from "@/components/header-cart-link";
import { HeaderProfileLink } from "@/components/header-profile-link";
import { HeaderSearch } from "@/components/header-search";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/collections", label: "Collections" },
];

export function Header() {
  return (
    <header className="bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center py-0.5">
          <Link
            href="/"
            className="text-[1.75rem] font-extrabold tracking-[-0.04em] text-foreground sm:text-4xl"
            prefetch
          >
            Rokn
          </Link>

          <nav className="absolute left-0 hidden items-center gap-6 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                prefetch
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="absolute right-0 flex items-center gap-2 sm:gap-4">
            <HeaderCartLink />
            <HeaderProfileLink />
          </div>
        </div>

        <HeaderSearch />
      </div>
    </header>
  );
}

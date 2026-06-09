"use client";

import {
  House,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartCount } from "@/components/cart-count-provider";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/products", label: "Discover", icon: ShoppingBag },
  { href: "/collections", label: "Categories", icon: LayoutGrid },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/account", label: "Profile", icon: User },
];

function isNavItemActive(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/products") {
    return pathname === "/products";
  }

  if (href === "/account") {
    return pathname.startsWith("/account");
  }

  return pathname.startsWith(href);
}

export function MobileNav() {
  const pathname = usePathname();
  const { count: itemCount } = useCartCount();

  return (
    <nav className="z-50 shrink-0 overflow-hidden rounded-t-3xl border-t border-border bg-surface/95 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md sm:hidden">
      <div className="flex min-h-[4.75rem] items-stretch justify-around pb-[env(safe-area-inset-bottom,0px)] pt-1.5">
        {navItems.map((item) => (
          <MobileNavItem
            key={item.href}
            item={item}
            pathname={pathname}
            itemCount={itemCount}
          />
        ))}
      </div>
    </nav>
  );
}

function MobileNavItem({
  item,
  pathname,
  itemCount,
}: {
  item: (typeof navItems)[number];
  pathname: string;
  itemCount: number;
}) {
  const active = isNavItemActive(item.href, pathname);
  const Icon = item.icon;
  const isCart = item.href === "/cart";

  return (
    <Link
      href={item.href}
      className={`flex flex-1 flex-col items-center gap-1 py-3.5 text-[10px] font-medium transition-colors ${
        active ? "text-foreground" : "text-muted"
      }`}
      aria-current={active ? "page" : undefined}
      aria-label={
        isCart && itemCount > 0
          ? `Cart, ${itemCount} items`
          : item.href === "/account"
            ? "Sign in to your account"
            : item.label
      }
      prefetch
    >
      <span className="relative">
        <Icon
          className="h-6 w-6"
          strokeWidth={active ? 2.5 : 1.75}
          aria-hidden
        />
        {isCart && itemCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold leading-none text-white">
            {itemCount}
          </span>
        )}
      </span>
      {item.label}
    </Link>
  );
}

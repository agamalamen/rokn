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
import { useEffect, useState } from "react";
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

function useActiveNavItem(href: string, pathname: string) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isNavItemActive(href, pathname));
  }, [href, pathname]);

  return active;
}

export function MobileNav() {
  const pathname = usePathname();
  const { count: itemCount } = useCartCount();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 backdrop-blur-md sm:hidden">
      <div className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom,0px)]">
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
  const active = useActiveNavItem(item.href, pathname);
  const Icon = item.icon;
  const isCart = item.href === "/cart";

  return (
    <Link
      href={item.href}
      className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
        active ? "text-foreground" : "text-muted"
      }`}
      aria-current={active ? "page" : undefined}
      aria-label={
        isCart && itemCount > 0 ? `Cart, ${itemCount} items` : item.label
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
          <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white">
            {itemCount}
          </span>
        )}
      </span>
      {item.label}
    </Link>
  );
}

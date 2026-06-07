"use client";

import {
  House,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/products", label: "Shop", icon: ShoppingBag },
  { href: "/collections", label: "Collections", icon: LayoutGrid },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
];

type MobileNavClientProps = {
  itemCount: number;
};

export function MobileNavClient({ itemCount }: MobileNavClientProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 backdrop-blur-md sm:hidden">
      <div className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom,0px)]">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          const isCart = item.href === "/cart";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-accent" : "text-muted"
              }`}
              aria-label={
                isCart && itemCount > 0
                  ? `Cart, ${itemCount} items`
                  : item.label
              }
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
        })}
      </div>
    </nav>
  );
}

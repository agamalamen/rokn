"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartCount } from "@/components/cart-count-provider";
import {
  isNavItemActive,
  primaryNavItems,
  profileNavItem,
  type AppNavItem,
} from "@/lib/app-nav";

type DesktopSidebarProps = {
  initialPathname: string;
};

type SidebarNavItemProps = {
  item: AppNavItem;
  pathname: string;
  itemCount: number;
};

function SidebarNavItem({ item, pathname, itemCount }: SidebarNavItemProps) {
  const active = isNavItemActive(item.href, pathname);
  const Icon = item.icon;
  const isCart = item.href === "/cart";

  return (
    <Link
      href={item.href}
      className={`flex h-11 w-11 items-center justify-center transition-colors ${
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
    </Link>
  );
}

export function DesktopSidebar({ initialPathname }: DesktopSidebarProps) {
  const clientPathname = usePathname();
  const pathname = clientPathname ?? initialPathname;
  const { count: itemCount } = useCartCount();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[4.5rem] flex-col items-center border-r border-border bg-white py-6 shadow-[4px_0_24px_rgba(0,0,0,0.04)] sm:flex">
      <nav
        aria-label="Main"
        className="flex flex-1 flex-col items-center justify-center gap-2"
      >
        {primaryNavItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            pathname={pathname}
            itemCount={itemCount}
          />
        ))}
      </nav>

      <SidebarNavItem
        item={profileNavItem}
        pathname={pathname}
        itemCount={itemCount}
      />
    </aside>
  );
}

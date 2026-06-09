import {
  House,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  User,
  type LucideIcon,
} from "lucide-react";

export type AppNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const primaryNavItems: AppNavItem[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/products", label: "Discover", icon: ShoppingBag },
  { href: "/collections", label: "Categories", icon: LayoutGrid },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
];

export const profileNavItem: AppNavItem = {
  href: "/account",
  label: "Profile",
  icon: User,
};

export const mobileNavItems: AppNavItem[] = [
  ...primaryNavItems,
  profileNavItem,
];

export function isNavItemActive(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/" || pathname === "";
  }

  if (href === "/products") {
    return pathname === "/products";
  }

  if (href === "/account") {
    return pathname.startsWith("/account");
  }

  return pathname.startsWith(href);
}

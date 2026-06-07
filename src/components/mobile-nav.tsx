import { fetchCart } from "@/actions/cart";
import { MobileNavClient } from "@/components/mobile-nav-client";

export async function MobileNav() {
  const cart = await fetchCart();
  const itemCount = cart?.totalQuantity ?? 0;

  return <MobileNavClient itemCount={itemCount} />;
}

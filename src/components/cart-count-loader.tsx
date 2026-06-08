"use client";

import { useEffect } from "react";
import { getCartCount } from "@/actions/cart";
import { useCartCount } from "@/components/cart-count-provider";

export function CartCountLoader() {
  const { setCount } = useCartCount();

  useEffect(() => {
    void getCartCount().then(setCount);
  }, [setCount]);

  return null;
}

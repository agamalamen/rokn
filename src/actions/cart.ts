"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { cache } from "react";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCartLine,
} from "@/lib/shopify";
import { CART_COOKIE_MAX_AGE, CART_COOKIE_NAME } from "@/lib/constants";

async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies();
  const existingCartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (existingCartId) {
    const cart = await getCart(existingCartId);
    if (cart) {
      return cart.id;
    }
  }

  const cart = await createCart();
  cookieStore.set(CART_COOKIE_NAME, cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  });

  return cart.id;
}

function revalidateCartPage() {
  revalidatePath("/cart");
}

export async function addItemToCart(
  variantId: string,
  quantity = 1,
): Promise<number> {
  const cartId = await getOrCreateCartId();
  const cart = await addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
  revalidateCartPage();
  return cart.totalQuantity;
}

export async function updateItemQuantity(
  lineId: string,
  quantity: number,
): Promise<number> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    throw new Error("Cart not found");
  }

  const cart =
    quantity <= 0
      ? await removeFromCart(cartId, [lineId])
      : await updateCartLine(cartId, [{ id: lineId, quantity }]);

  revalidateCartPage();
  return cart.totalQuantity;
}

export async function removeItemFromCart(lineId: string): Promise<number> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    throw new Error("Cart not found");
  }

  const cart = await removeFromCart(cartId, [lineId]);
  revalidateCartPage();
  return cart.totalQuantity;
}

export const fetchCart = cache(async function fetchCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    return null;
  }

  return getCart(cartId);
});

"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CartCountContextValue = {
  count: number;
  setCount: (count: number) => void;
};

const CartCountContext = createContext<CartCountContextValue | null>(null);

type CartCountProviderProps = {
  initialCount: number;
  children: ReactNode;
};

export function CartCountProvider({
  initialCount,
  children,
}: CartCountProviderProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <CartCountContext.Provider value={{ count, setCount }}>
      {children}
    </CartCountContext.Provider>
  );
}

export function useCartCount() {
  const context = useContext(CartCountContext);

  if (!context) {
    throw new Error("useCartCount must be used within CartCountProvider");
  }

  return context;
}

type CheckoutButtonProps = {
  checkoutUrl: string;
};

export function CheckoutButton({ checkoutUrl }: CheckoutButtonProps) {
  return (
    <a
      href={checkoutUrl}
      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
    >
      Checkout with Shopify
    </a>
  );
}

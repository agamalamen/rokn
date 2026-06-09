type CheckoutButtonProps = {
  checkoutUrl: string;
};

export function CheckoutButton({ checkoutUrl }: CheckoutButtonProps) {
  return (
    <a
      href={checkoutUrl}
      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-cta px-6 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover"
    >
      Checkout
    </a>
  );
}

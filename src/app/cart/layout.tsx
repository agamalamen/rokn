export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex-1 pb-nav">{children}</main>;
}

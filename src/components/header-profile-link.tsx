import { User } from "lucide-react";
import Link from "next/link";

export function HeaderProfileLink() {
  return (
    <Link
      href="/account"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface"
      aria-label="Account"
    >
      <User className="h-6 w-6 text-foreground" strokeWidth={1.75} />
    </Link>
  );
}

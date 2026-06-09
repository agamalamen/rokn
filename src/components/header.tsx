import Link from "next/link";
import { HeaderSearch } from "@/components/header-search";

export function Header() {
  return (
    <header className="bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center py-0.5">
          <Link
            href="/"
            className="text-[1.75rem] font-extrabold tracking-[-0.04em] text-foreground sm:text-4xl"
            prefetch
          >
            Rokn
          </Link>
        </div>

        <HeaderSearch />
      </div>
    </header>
  );
}

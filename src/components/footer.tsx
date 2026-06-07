import Link from "next/link";

const informationLinks = [
  { href: "/about", label: "About" },
  { href: "/about", label: "Help center" },
];

const socialLinks = [
  { href: "https://www.instagram.com/rukncrafts/", label: "Instagram" },
  { href: "https://www.facebook.com/rukn.net", label: "Facebook" },
];

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

function FooterSection({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface pb-nav sm:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <FooterSection title="Information" links={informationLinks} />
          <FooterSection
            title="Social"
            links={socialLinks.map((link) => ({ ...link, external: true }))}
          />
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Sprout } from "lucide-react";

const footerNav = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Farmer Dashboard" },
  { href: "/score", label: "Scoring" },
  { href: "/admin", label: "VYC Admin" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sprout className="h-4 w-4" />
          <span>AgriTrust — smallholder farming, financed by behavior.</span>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {footerNav.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
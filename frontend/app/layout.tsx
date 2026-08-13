import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://agrit.stellarvhibes.org"),
  title: { template: "%s | AgriTrust", default: "AgriTrust — Verifiable Yield Certificates" },
  description: "Verifiable Yield Certificates for Smallholder Farmers",
  keywords: ["AgriTrust", "VYC", "Verifiable Yield Certificates", "Stellar", "smallholder", "microcredit"],
  authors: [{ name: "AgriTrust" }],
  creator: "AgriTrust",
  openGraph: {
    type: "website",
    title: "AgriTrust — Verifiable Yield Certificates",
    description: "Borrow against your behavior, not your paperwork.",
    siteName: "AgriTrust",
    images: [{ url: "/agrit-logo.svg", width: 1254, height: 1254, alt: "AgriTrust Logo" }],
  },
  twitter: {
    card: "summary",
    title: "AgriTrust",
    description: "Verifiable Yield Certificates for Smallholder Farmers",
    images: ["/agrit-logo.svg"],
  },
  icons: {
    icon: "/agrit-logo.svg",
    shortcut: "/agrit-logo.svg",
    apple: "/agrit-logo.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

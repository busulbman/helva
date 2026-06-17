import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/config";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.name} - ${siteConfig.slogan}. Geleneksel el yapımı çekme helva, reçel ve yöresel ürünler. Kastamonu.`,
  keywords: [
    "çekme helva",
    "Kastamonu",
    "geleneksel tatlı",
    "el yapımı helva",
    "Türk tatlısı",
    "reçel",
    "hediye paketi",
    "yöresel ürünler",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.slogan,
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-background">
        {children}
      </body>
    </html>
  );
}

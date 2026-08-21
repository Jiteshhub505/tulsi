import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tulsiveda - Pure Ayurvedic Wellness",
  description: "Natural Ayurvedic formulations and health wellness products.",
  icons: {
    icon: "/tulsiveda-logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://cdn.britannica.com" />
        <link rel="preconnect" href="https://5.imimg.com" />
        <link rel="preconnect" href="https://thursd.com" />
        <link rel="preconnect" href="https://images.saymedia-content.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://cdn.britannica.com" />
        <link rel="dns-prefetch" href="https://5.imimg.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

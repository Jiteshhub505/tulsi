import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "../components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Mono only used in admin/code blocks — don't preload globally
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
        {/* Google Tag Manager — afterInteractive so it doesn't block FCP */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NQZLPW3D');`,
          }}
        />

        {/* CDN Preconnects — critical image origins */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.britannica.com" crossOrigin="anonymous" />

        {/* DNS Prefetch — secondary image origins */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://5.imimg.com" />
        <link rel="dns-prefetch" href="https://thursd.com" />
        <link rel="dns-prefetch" href="https://images.saymedia-content.com" />

        {/* Preload first hero slide images to improve LCP */}
        <link
          rel="preload"
          as="image"
          href="/tul-web2.webp"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          href="/tul-mob1.webp"
          media="(max-width: 767px)"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NQZLPW3D"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, ShoppingCart, Menu, X, Home, ShoppingBag, Info } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import CartDrawer from "./CartDrawer";
import axios from "axios";
import { getFavorites } from "@/lib/favorites";

import { useLanguage } from "@/context/language-context";

// ── Mobile Drawer rendered via Portal so it escapes nav's stacking context ──
function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
      }}
    >
      {/* Dark backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: "relative",
          width: "280px",
          height: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
          zIndex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            backgroundColor: "#065f46",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.15em",
              fontSize: "13px",
              textTransform: "uppercase",
            }}
          >
            TulsiVeda
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.85)",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav Links */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 16px",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {[
            { href: "/", label: "Home", icon: <Home size={18} /> },
            { href: "/shop", label: "Shop", icon: <ShoppingBag size={18} /> },
            { href: "/about-us", label: "About Us", icon: <Info size={18} /> },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "13px 16px",
                borderRadius: "12px",
                color: "#065f46",
                fontWeight: 600,
                fontSize: "16px",
                textDecoration: "none",
                backgroundColor: "transparent",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "#d1fae5")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
              }
            >
              <span style={{ color: "#059669" }}>{icon}</span>
              {label}
            </Link>
          ))}

          {/* Language Switcher in Mobile Drawer */}
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "10px 16px",
                borderRadius: "10px",
                backgroundColor: "#ecfdf5",
                color: "#047857",
                fontWeight: 600,
                fontSize: "14px",
                border: "1px solid #a7f3d0",
                cursor: "pointer",
              }}
            >
              <span>🌐</span>
              <span>{language === "en" ? "हिन्दी" : "English"}</span>
            </button>
          </div>
        </nav>

        {/* Bottom accent bar */}
        <div
          style={{
            height: "4px",
            background: "linear-gradient(to right, #34d399, #065f46)",
            flexShrink: 0,
          }}
        />
      </div>
    </div>,
    document.body
  );
}

// ── Main Header ──────────────────────────────────────────────────────────────
export const Header = () => {
  const { data: session, status } = useSession();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const updateFavoritesCount = () => {
    setFavoritesCount(getFavorites().length);
  };

  const fetchCartCount = async () => {
    try {
      const response = await axios.get("/api/cart/fetchcart");
      if (response.data.success) {
        const count = response.data.items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
    updateFavoritesCount();
    window.addEventListener("cart-updated", fetchCartCount);
    window.addEventListener("favorites-updated", updateFavoritesCount);
    return () => {
      window.removeEventListener("cart-updated", fetchCartCount);
      window.removeEventListener("favorites-updated", updateFavoritesCount);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-emerald-50/90 backdrop-blur-md border-b border-emerald-100/80 shadow-sm px-6 md:px-12 lg:px-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 md:py-4">

          {/* Left: Hamburger (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-slate-700 hover:text-emerald-800 p-1 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Left: Nav Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-slate-700 font-semibold hover:text-emerald-700 transition-colors text-[14px]">
              Home
            </Link>
            <Link href="/shop" className="text-slate-600 font-semibold hover:text-emerald-700 transition-colors text-[14px]">
              Shop
            </Link>
            <Link href="/about-us" className="text-slate-600 font-semibold hover:text-emerald-700 transition-colors text-[14px]">
              About Us
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center select-none">
            <Link href="/">
              <img
                src="/tulsiveda-logo.png"
                alt="Tulsiveda Logo"
                className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Language Switcher Button (Desktop & Tablet) */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
              aria-label="Switch Language"
            >
              <span>🌐</span>
              <span>{language === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* Wishlist */}
            <Link
              href="/favorites"
              className="text-slate-600 hover:text-emerald-700 transition-colors p-1 relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full text-[9px] size-3.5 flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart — Sheet drawer for ALL screen sizes */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="text-slate-600 hover:text-emerald-700 transition-colors p-1 relative cursor-pointer"
                  aria-label="Shopping Cart"
                  suppressHydrationWarning
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full text-[9px] size-3.5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <CartDrawer />
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer — rendered at document.body via Portal */}
      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};


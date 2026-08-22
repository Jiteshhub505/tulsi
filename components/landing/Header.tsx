"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShoppingCart, Menu, X, Home, ShoppingBag, Info, User, LogOut } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import CartDrawer from "./CartDrawer";
import axios from "axios";
import { getFavorites } from "@/lib/favorites";
import LoginModal from "./LoginModal";
import { useLanguage } from "@/context/language-context";

// ── Mobile Drawer rendered via Portal so it escapes nav's stacking context ──
function MobileDrawer({
  open,
  onClose,
  verifiedPhone,
  walletBalance,
  onLoginClick,
  onLogoutClick,
}: {
  open: boolean;
  onClose: () => void;
  verifiedPhone: string | null;
  walletBalance: number | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

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
          {/* User Account / Login in Drawer */}
          {verifiedPhone ? (
            <div className="p-3 mb-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-stone-900">+91 {verifiedPhone.slice(-10)}</p>
                <p className="text-[11px] font-extrabold text-emerald-700">🪙 {walletBalance || 0} Coins</p>
              </div>
              <button
                onClick={onLogoutClick}
                className="p-1.5 text-stone-500 hover:text-red-600 rounded-lg"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onLoginClick();
              }}
              className="w-full mb-3 flex items-center justify-center gap-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-xs"
            >
              <User size={16} />
              Login
            </button>
          )}

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
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

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

  // Persistent user login check
  const checkPersistentUser = () => {
    if (typeof window === "undefined") return;
    const phone = localStorage.getItem("tulsi_user_phone");
    if (phone && phone.length === 10) {
      setVerifiedPhone(phone);
      axios
        .get(`/api/rewards/wallet?phone=${phone}`)
        .then((res) => {
          if (res.data.success && res.data.found) {
            setWallet(res.data.wallet);
            setWalletBalance(res.data.wallet.balance);
            localStorage.setItem("tulsi_wallet", JSON.stringify(res.data.wallet));
          }
        })
        .catch(() => {});
    } else {
      setVerifiedPhone(null);
      setWallet(null);
      setWalletBalance(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tulsi_user_phone");
    localStorage.removeItem("tulsi_wallet");
    setVerifiedPhone(null);
    setWallet(null);
    setWalletBalance(null);
    window.dispatchEvent(new CustomEvent("wallet-updated", { detail: null }));
  };

  useEffect(() => {
    fetchCartCount();
    updateFavoritesCount();
    checkPersistentUser();

    const handleWalletUpdate = (e: any) => {
      if (e?.detail) {
        setWallet(e.detail);
        if (e.detail.phone) {
          setVerifiedPhone(e.detail.phone);
        }
        if (e.detail.balance !== undefined) {
          setWalletBalance(e.detail.balance);
        }
      } else {
        checkPersistentUser();
      }
    };

    window.addEventListener("cart-updated", fetchCartCount);
    window.addEventListener("favorites-updated", updateFavoritesCount);
    window.addEventListener("wallet-updated", handleWalletUpdate);
    return () => {
      window.removeEventListener("cart-updated", fetchCartCount);
      window.removeEventListener("favorites-updated", updateFavoritesCount);
      window.removeEventListener("wallet-updated", handleWalletUpdate);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-emerald-50/90 backdrop-blur-md border-b border-emerald-100/80 shadow-sm px-6 md:px-12 lg:px-16 2xl:px-24 transition-all duration-300">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto flex items-center justify-between py-3 md:py-4 2xl:py-5">

          {/* Left: Hamburger (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-slate-700 hover:text-emerald-800 p-1 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Left: Nav Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8 2xl:gap-12">
            <Link href="/" className="text-slate-700 font-semibold hover:text-emerald-700 transition-colors text-[14px] 2xl:text-[16px]">
              Home
            </Link>
            <Link href="/shop" className="text-slate-600 font-semibold hover:text-emerald-700 transition-colors text-[14px] 2xl:text-[16px]">
              Shop
            </Link>
            <Link href="/about-us" className="text-slate-600 font-semibold hover:text-emerald-700 transition-colors text-[14px] 2xl:text-[16px]">
              About Us
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center select-none">
            <Link href="/">
              <img
                src="/tulsiveda-logo.webp"
                alt="Tulsiveda Logo"
                className="h-14 md:h-16 2xl:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Language Switcher Button (Desktop & Tablet) */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
              aria-label="Switch Language"
            >
              <span>🌐</span>
              <span>{language === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* Authentication / User Section */}
            {verifiedPhone ? (
              <div className="flex items-center gap-1.5 bg-emerald-100/90 hover:bg-emerald-200/90 border border-emerald-300 rounded-full pl-3 pr-1.5 py-1 text-emerald-950 text-xs font-bold shadow-xs transition">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 hover:text-emerald-800 transition"
                  title="View Profile, Orders & Coins"
                >
                  <span className="text-amber-600">🪙</span>
                  <span>{walletBalance !== null ? walletBalance : (wallet?.balance ?? 0)}</span>
                  <div className="flex items-center justify-center size-6 rounded-full bg-emerald-800 text-white shadow-xs">
                    <User size={13} />
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="p-1 hover:bg-emerald-300/60 rounded-full text-stone-500 hover:text-red-700 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                title="Login to TulsiVeda"
              >
                <User size={14} />
                <span>Login</span>
              </button>
            )}

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
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        verifiedPhone={verifiedPhone}
        walletBalance={walletBalance}
        onLoginClick={() => setLoginModalOpen(true)}
        onLogoutClick={handleLogout}
      />

      {/* Dedicated Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={(updatedWallet) => {
          if (updatedWallet?.balance !== undefined) {
            setWallet(updatedWallet);
            setWalletBalance(updatedWallet.balance);
            if (updatedWallet.phone) {
              setVerifiedPhone(updatedWallet.phone);
            }
          }
        }}
      />
    </>
  );
};

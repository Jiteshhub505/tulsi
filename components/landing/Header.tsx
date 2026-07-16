"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import CartDrawer from "./CartDrawer";
import axios from "axios";
import { getFavorites } from "@/lib/favorites";

export const Header = () => {
  const { data: session, status } = useSession();
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
        const count = response.data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
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
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200 shadow-sm px-6 md:px-12 lg:px-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 md:py-4">
        
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

        {/* Left: Hamburger (Mobile) */}
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden text-slate-700 hover:text-emerald-800 p-1 cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

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
        <div className="flex items-center gap-3 md:gap-5">
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

          {/* Cart with count badge */}
          {/* Mobile Cart Link */}
          <Link 
            href="/cart"
            className="text-slate-600 hover:text-emerald-700 transition-colors p-1 relative lg:hidden"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full text-[9px] size-3.5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Desktop Cart Sidebar Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <button 
                className="text-slate-600 hover:text-emerald-700 transition-colors p-1 relative hidden lg:flex cursor-pointer"
                aria-label="Shopping Cart Drawer"
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

      {/* Mobile Navigation Drawer */}
      <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className={`absolute top-0 left-0 w-[280px] h-full bg-white p-6 shadow-2xl transition-transform duration-300 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex items-center justify-between pb-6 border-b border-emerald-950/5">
            <span className="font-bold text-emerald-900 tracking-wider">TULSIVEDA</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 hover:text-emerald-800 p-1"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-5 pt-8">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 font-semibold hover:text-emerald-700 text-lg transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-600 font-semibold hover:text-emerald-700 text-lg transition-colors"
            >
              Shop
            </Link>
            <Link 
              href="/about-us" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-600 font-semibold hover:text-emerald-700 text-lg transition-colors"
            >
              About Us
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
};

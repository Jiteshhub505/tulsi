"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Gift } from "lucide-react";
import SpinWheelModal from "./SpinWheelModal";
import axios from "axios";

export default function FloatingSpinToWin() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkSpunStatus = () => {
      if (typeof window === "undefined") return;
      if (localStorage.getItem("tulsi_has_spun") === "true") {
        setHasSpun(true);
        return;
      }
      const savedPhone = localStorage.getItem("tulsi_user_phone");
      if (savedPhone && savedPhone.length === 10) {
        axios
          .get(`/api/rewards/wallet?phone=${savedPhone}`)
          .then((res) => {
            if (res.data?.success && res.data?.wallet?.hasSpunWheel) {
              setHasSpun(true);
              localStorage.setItem("tulsi_has_spun", "true");
            }
          })
          .catch(() => {});
      }
    };

    checkSpunStatus();

    const handleWalletUpdate = (e: any) => {
      if (e?.detail?.hasSpunWheel || localStorage.getItem("tulsi_has_spun") === "true") {
        setHasSpun(true);
      }
    };

    const handleOpenModal = () => {
      setModalOpen(true);
    };

    window.addEventListener("wallet-updated", handleWalletUpdate);
    window.addEventListener("open-spin-modal", handleOpenModal);
    return () => {
      window.removeEventListener("wallet-updated", handleWalletUpdate);
      window.removeEventListener("open-spin-modal", handleOpenModal);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Bottom Right Circular Button (Only if not yet spun) */}
      {!hasSpun && (
        <aside
          aria-label="Spin and Win promotion"
          className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="group relative flex flex-col items-center justify-center size-20 sm:size-22 rounded-full bg-gradient-to-tr from-emerald-900 via-emerald-800 to-emerald-700 hover:from-emerald-800 hover:to-emerald-600 text-white shadow-[0_10px_30px_rgba(6,95,70,0.45)] border-3 border-amber-400/90 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer select-none"
          >
            {/* Subtle Rotating Pulse Glow */}
            <div className="absolute inset-0 rounded-full border border-amber-400/50 animate-ping opacity-20 pointer-events-none" />

            {/* Gift Icon with playful animation */}
            <div className="relative mb-0.5 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
              <Gift className="size-6 text-amber-400 fill-amber-400/20 stroke-[2.5]" />
              <Sparkles className="absolute -top-1.5 -right-2 size-3 text-amber-300 fill-amber-300 animate-pulse" />
            </div>

            {/* Text: Spin and win */}
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-amber-300 leading-tight text-center px-1">
              Spin and win
            </span>
          </button>
        </aside>
      )}

      {/* Gamified Spin Wheel Modal with 2factor OTP */}
      <SpinWheelModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={(wallet) => {
          setHasSpun(true);
          localStorage.setItem("tulsi_has_spun", "true");
          window.dispatchEvent(new CustomEvent("wallet-updated", { detail: wallet }));
        }}
      />
    </>
  );
}

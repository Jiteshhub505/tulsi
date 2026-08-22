"use client";

import React, { useState, useEffect } from "react";
import { Coins, Sparkles, X, ShieldCheck, CheckCircle2, Loader2, Gift, ArrowRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface CoinRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
  onVerified?: (wallet: any) => void;
}

export default function CoinRewardModal({
  isOpen,
  onClose,
  initialPhone = "",
  onVerified,
}: CoinRewardModalProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    if (initialPhone) {
      setPhone(initialPhone.replace(/\D/g, "").slice(-10));
    }
  }, [initialPhone]);

  useEffect(() => {
    if (phone.length === 10) {
      // Auto fetch existing wallet status
      axios
        .get(`/api/rewards/wallet?phone=${phone}`)
        .then((res) => {
          if (res.data?.success && res.data.wallet) {
            setWallet(res.data.wallet);
          }
        })
        .catch(() => {});
    }
  }, [phone]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/rewards/send-otp", { phone: cleanPhone });
      if (res.data.success) {
        setSessionId(res.data.sessionId || "");
        setStep("otp");
        toast.success(res.data.message || "OTP sent to your phone via SMS!");
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send SMS OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length < 4) {
      toast.error("Please enter the 4-6 digit OTP");
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      const res = await axios.post("/api/rewards/verify-otp", {
        phone: cleanPhone,
        sessionId,
        otp: otp.trim(),
      });

      if (res.data.success) {
        setWallet(res.data.wallet);
        setStep("success");
        toast.success(res.data.message || "🎉 Phone verified!");
        if (onVerified) {
          onVerified(res.data.wallet);
        }
        window.dispatchEvent(new CustomEvent("wallet-updated", { detail: res.data.wallet }));
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Gold Gradient Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 p-6 text-stone-950 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/20 blur-sm pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-stone-950 text-amber-400 rounded-2xl shadow-md">
              <Coins className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-stone-950">
                Tulsi Rewards & Coins
              </h2>
              <p className="text-xs font-semibold text-stone-900/80">
                1 Tulsi Coin = ₹1 Instant Discount
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {step === "phone" && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-3">
                <Gift className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-950">Claim 100 Welcome Coins</h4>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    Verify your phone number with 2factor SMS OTP to get ₹100 instant discount on your orders!
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full pl-13 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl font-semibold text-sm focus:border-amber-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || phone.length !== 10}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? "Sending SMS..." : "Send OTP via 2factor.in"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-stone-500">
                  Enter the SMS OTP sent to <span className="font-bold text-stone-900">+91 {phone}</span>
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 bg-stone-50 border-2 border-amber-400 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || !otp}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {loading ? "Verifying..." : "Verify & Unlock Coins"}
              </button>

              <button
                onClick={() => setStep("phone")}
                className="w-full text-center text-xs font-semibold text-stone-500 hover:text-stone-800"
              >
                Change mobile number
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900">Wallet Verified!</h3>
                <p className="text-xs text-stone-600 mt-1">
                  You have <span className="font-bold text-amber-600 text-sm">{wallet?.balance || 100} Tulsi Coins</span> ready to redeem on checkout.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition"
              >
                Done
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" /> Secure 2factor.in SMS OTP Authentication
          </div>
        </div>
      </div>
    </div>
  );
}

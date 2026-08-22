"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ShieldCheck, CheckCircle2, Loader2, ArrowRight, Smartphone } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (wallet: any) => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);

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
        toast.success(res.data.message || "OTP sent to your mobile via SMS!");
      } else {
        toast.error(res.data.message || "Failed to send SMS OTP");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send SMS OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length < 4) {
      toast.error("Please enter the OTP sent to your phone");
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
        localStorage.setItem("tulsi_user_phone", cleanPhone);
        if (res.data.wallet) {
          localStorage.setItem("tulsi_wallet", JSON.stringify(res.data.wallet));
        }
        window.dispatchEvent(new CustomEvent("wallet-updated", { detail: res.data.wallet }));
        toast.success("Logged in successfully!");
        if (onSuccess) {
          onSuccess(res.data.wallet);
        }
        onClose();
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
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden text-stone-900">
        {/* Header */}
        <div className="pt-6 pb-4 px-6 flex flex-col items-center justify-center relative border-b border-emerald-50 bg-gradient-to-b from-emerald-50/60 to-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-md border-2 border-emerald-100 mb-2">
            <Image
              src="/tulsiveda-logo.webp"
              alt="TulsiVeda Logo"
              width={48}
              height={48}
              priority
              className="object-contain"
            />
          </div>

          <h3 className="font-extrabold text-lg text-emerald-950 tracking-tight">
            Login to TulsiVeda
          </h3>
          <p className="text-xs text-emerald-700/80 font-semibold tracking-wide mt-0.5">
            Access your orders, addresses & coin rewards
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === "phone" && (
            <div className="space-y-4">
              <div className="text-left space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full pl-13 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl font-bold text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || phone.length !== 10}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                {loading ? "Sending SMS OTP..." : "Get OTP via 2factor.in"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4 text-center">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs">
                <ShieldCheck className="w-7 h-7 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-stone-900">Enter OTP</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Sent to <span className="font-bold text-emerald-900">+91 {phone}</span>
                </p>
              </div>

              <div className="py-2">
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 bg-stone-50 border-2 border-emerald-600 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || !otp}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>

              <button
                onClick={() => setStep("phone")}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Change mobile number
              </button>
            </div>
          )}

          <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Powered by 2factor.in SMS OTP
          </div>
        </div>
      </div>
    </div>
  );
}

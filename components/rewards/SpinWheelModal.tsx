"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, ShieldCheck, CheckCircle2, Loader2, Coins, ArrowRight, Lock, User, LogOut } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (wallet: any) => void;
}

const SEGMENTS = [
  { label: "₹5", value: 5, color: "#065f46", textColor: "#ffffff" },
  { label: "₹100", value: 100, color: "#d97706", textColor: "#ffffff" },
  { label: "₹10", value: 10, color: "#047857", textColor: "#ffffff" },
  { label: "₹50", value: 50, color: "#f59e0b", textColor: "#ffffff" },
  { label: "₹5", value: 5, color: "#059669", textColor: "#ffffff" },
  { label: "₹25", value: 25, color: "#10b981", textColor: "#ffffff" },
];

export default function SpinWheelModal({
  isOpen,
  onClose,
  onSuccess,
}: SpinWheelModalProps) {
  const [step, setStep] = useState<"phone" | "otp" | "spin" | "already_spun" | "claimed">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonAmount, setWonAmount] = useState(5);
  const [wallet, setWallet] = useState<any>(null);

  // Auto-check persistent login from localStorage when opened
  useEffect(() => {
    if (!isOpen) return;

    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("tulsi_user_phone") : null;
    if (savedPhone && savedPhone.length === 10) {
      setPhone(savedPhone);
      // Fetch fresh wallet details
      axios
        .get(`/api/rewards/wallet?phone=${savedPhone}`)
        .then((res) => {
          if (res.data.success && res.data.found) {
            const w = res.data.wallet;
            setWallet(w);
            localStorage.setItem("tulsi_wallet", JSON.stringify(w));
            if (w.isPhoneVerified) {
              if (w.hasSpunWheel) {
                setStep("already_spun");
              } else {
                setStep("spin");
              }
            } else {
              setStep("phone");
            }
          }
        })
        .catch(() => {
          // fallback to phone step
        });
    } else {
      setStep("phone");
      setOtp("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Step 1: Send SMS OTP
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

  // Step 2: Verify OTP via 2factor.in & Persist Login
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
        setWallet(res.data.wallet);
        // Persist verified phone & wallet in localStorage
        localStorage.setItem("tulsi_user_phone", cleanPhone);
        localStorage.setItem("tulsi_wallet", JSON.stringify(res.data.wallet));
        window.dispatchEvent(new CustomEvent("wallet-updated", { detail: res.data.wallet }));

        if (res.data.hasSpunWheel) {
          setStep("already_spun");
          toast("You have already used your 1-time spin!", { icon: "ℹ️" });
        } else {
          // UNLOCK SPIN WHEEL ONLY AFTER OTP IS VERIFIED!
          setStep("spin");
          toast.success("Mobile verified! Spin wheel unlocked 🎁");
        }
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Spin the Wheel & Claim Controlled Reward
  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    // Probability: 55% for ₹5, 40% for ₹10, 5% for ₹25 (₹50 & ₹100 never land)
    const rand = Math.random() * 100;
    let targetIndex: number;
    let prizeValue: number;

    if (rand < 55) {
      const alt = Math.random() < 0.5;
      targetIndex = alt ? 4 : 0;
      prizeValue = 5;
    } else if (rand < 95) {
      targetIndex = 2;
      prizeValue = 10;
    } else {
      targetIndex = 5;
      prizeValue = 25;
    }

    setWonAmount(prizeValue);

    // Calculate exact stopping angle at 12 o'clock (270 deg)
    const segmentAngle = 360 / SEGMENTS.length;
    const segmentCenter = targetIndex * segmentAngle + segmentAngle / 2;
    const extraRotations = (5 + Math.floor(Math.random() * 3)) * 360;
    const currentNorm = rotation % 360;
    const neededOffset = (270 - segmentCenter - currentNorm + 360) % 360;
    const finalRotation = rotation + extraRotations + neededOffset;

    setRotation(finalRotation);

    setTimeout(async () => {
      setSpinning(false);
      try {
        const cleanPhone = phone.replace(/\D/g, "").slice(-10);
        const claimRes = await axios.post("/api/rewards/claim-spin", {
          phone: cleanPhone,
          amount: prizeValue,
        });

        if (claimRes.data.success) {
          setWallet(claimRes.data.wallet);
          localStorage.setItem("tulsi_wallet", JSON.stringify(claimRes.data.wallet));
          localStorage.setItem("tulsi_has_spun", "true");
          setStep("claimed");
          toast.success(`🎉 ₹${prizeValue} Tulsi Coins added to your wallet!`);
          if (onSuccess) {
            onSuccess(claimRes.data.wallet);
          }
          window.dispatchEvent(new CustomEvent("wallet-updated", { detail: claimRes.data.wallet }));
        } else {
          toast.error(claimRes.data.message || "Failed to claim spin reward");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to record spin reward");
      }
    }, 4500);
  };

  const handleLogout = () => {
    localStorage.removeItem("tulsi_user_phone");
    localStorage.removeItem("tulsi_wallet");
    setPhone("");
    setOtp("");
    setWallet(null);
    setStep("phone");
    window.dispatchEvent(new CustomEvent("wallet-updated", { detail: null }));
    toast.success("Logged out successfully");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden text-stone-900">
        {/* Top Header with TulsiVeda Logo */}
        <div className="pt-6 pb-4 px-6 flex flex-col items-center justify-center relative border-b border-emerald-50 bg-gradient-to-b from-emerald-50/70 to-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* TulsiVeda Brand Logo */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-md border-2 border-emerald-100 mb-2">
            <Image
              src="/tulsiveda-logo.webp"
              alt="TulsiVeda Logo"
              width={54}
              height={54}
              priority
              className="object-contain"
            />
          </div>

          <h3 className="font-extrabold text-lg text-emerald-950 tracking-tight">
            TULSIVEDA REWARDS
          </h3>
          <p className="text-xs text-emerald-700/80 font-semibold tracking-wide mt-0.5">
            Pure Ayurvedic Wellness • Tulsi Coins Wallet
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: MOBILE NUMBER INPUT */}
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

          {/* STEP 2: OTP INPUT */}
          {step === "otp" && (
            <div className="space-y-4 text-center">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs">
                <ShieldCheck className="w-7 h-7 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-stone-900">Enter Verification Code</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  SMS OTP sent to <span className="font-bold text-emerald-900">+91 {phone}</span>
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
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <button
                onClick={() => setStep("phone")}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Change mobile number
              </button>
            </div>
          )}

          {/* STEP 3: SPIN WHEEL (ONLY UNLOCKED AFTER MOBILE OTP IS VERIFIED!) */}
          {step === "spin" && (
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ✓ Verified (+91 {phone})
                </span>
                <h4 className="text-xl font-black text-stone-900 mt-2">
                  Spin to Win Your Reward!
                </h4>
              </div>

              {/* Spinning Wheel Container */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* Pointer Top Arrow at 12 o'clock */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-500 filter drop-shadow-md" />

                {/* Outer Glow Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-emerald-600/30 shadow-[0_0_20px_rgba(5,150,105,0.25)] pointer-events-none" />

                {/* Rotating SVG Wheel */}
                <div
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning ? "transform 4.5s cubic-bezier(0.15, 0.9, 0.2, 1)" : "none",
                  }}
                  className="w-full h-full rounded-full shadow-inner overflow-hidden relative"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {SEGMENTS.map((seg, idx) => {
                      const angle = 360 / SEGMENTS.length;
                      const startAngle = idx * angle;
                      const endAngle = startAngle + angle;
                      const radStart = (startAngle * Math.PI) / 180;
                      const radEnd = (endAngle * Math.PI) / 180;
                      const x1 = 50 + 50 * Math.cos(radStart);
                      const y1 = 50 + 50 * Math.sin(radStart);
                      const x2 = 50 + 50 * Math.cos(radEnd);
                      const y2 = 50 + 50 * Math.sin(radEnd);
                      const path = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                      const midAngle = startAngle + angle / 2;
                      const textRad = (midAngle * Math.PI) / 180;
                      const tx = 50 + 32 * Math.cos(textRad);
                      const ty = 50 + 32 * Math.sin(textRad);

                      return (
                        <g key={idx}>
                          <path d={path} fill={seg.color} stroke="#ffffff" strokeWidth="1" />
                          <text
                            x={tx}
                            y={ty}
                            fill={seg.textColor}
                            fontSize="6"
                            fontWeight="900"
                            textAnchor="middle"
                            dominantBaseline="central"
                            transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                          >
                            {seg.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Center Hub */}
                <div className="absolute z-10 w-12 h-12 rounded-full bg-white border-2 border-emerald-700 shadow-lg flex items-center justify-center font-black text-[10px] text-emerald-950">
                  TULSI
                </div>
              </div>

              {/* Spin Action Button */}
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm tracking-wider uppercase rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 fill-white" />
                {spinning ? "SPINNING..." : "SPIN THE WHEEL (1-TIME)"}
              </button>
            </div>
          )}

          {/* ALREADY SPUN / LOGGED IN WALLET SCREEN */}
          {step === "already_spun" && (
            <div className="space-y-4 py-1">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Verified Number
                  </span>
                  <p className="text-base font-extrabold text-stone-900">+91 {phone}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Wallet Balance
                  </span>
                  <p className="text-lg font-black text-emerald-700">🪙 {wallet?.balance || 0} Coins</p>
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs text-stone-600">
                  You have already used your 1-time spin. Your balance of{" "}
                  <span className="font-bold text-emerald-700">₹{wallet?.balance || 0}</span> is ready to apply in checkout!
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Use in Checkout (-₹{wallet?.balance || 0})
                </button>
                <button
                  onClick={handleLogout}
                  className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition cursor-pointer"
                  title="Logout / Change Number"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* CLAIMED SCREEN */}
          {step === "claimed" && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-emerald-950">🎉 ₹{wonAmount} Coins Won!</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  ₹{wonAmount} Tulsi Coins are saved to your verified number <span className="font-bold text-stone-900">+91 {phone}</span>.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Use in Checkout (-₹{wonAmount})
              </button>
            </div>
          )}

          <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Powered by 2factor.in SMS OTP
          </div>
        </div>
      </div>
    </div>
  );
}

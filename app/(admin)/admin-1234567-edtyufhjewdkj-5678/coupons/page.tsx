"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Ticket,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  Percent,
  IndianRupee,
  Calendar,
  Layers,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Dices,
} from "lucide-react";

interface CouponItem {
  _id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  expiryDate?: string | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState<number | "">(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number | "">("");
  const [maxDiscount, setMaxDiscount] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState<number | "">("");

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/coupons");
      if (res.data.success) {
        setCoupons(res.data.coupons || []);
      }
    } catch (err: any) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const generateRandomCode = () => {
    const prefixes = ["TULSI", "VEDA", "AYUR", "HERB", "HEALTH", "FESTIVE", "SPECIAL", "SUPER"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const val = discountValue || 15;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setCode(`${randomPrefix}${val}_${randomSuffix}`);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter or generate a coupon code");
      return;
    }
    if (!discountValue || Number(discountValue) <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("/api/admin/coupons", {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        expiryDate: expiryDate || null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Coupon created successfully!");
        setCode("");
        setDiscountValue(10);
        setMinOrderAmount("");
        setMaxDiscount("");
        setExpiryDate("");
        setUsageLimit("");
        fetchCoupons();
      } else {
        toast.error(res.data.message || "Failed to create coupon");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon '${couponCode}'?`)) return;

    try {
      const res = await axios.delete(`/api/admin/coupons?id=${id}`);
      if (res.data.success) {
        toast.success(`Coupon '${couponCode}' deleted!`);
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete coupon");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await axios.patch("/api/admin/coupons", {
        id,
        isActive: !currentStatus,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setCoupons((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isActive: !currentStatus } : c))
        );
      }
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied '${text}' to clipboard!`);
  };

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Ticket className="size-7 text-emerald-700" />
            Coupon Codes & Discounts
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Generate, manage, activate and delete custom discount coupon codes for checkout.
          </p>
        </div>

        <button
          onClick={fetchCoupons}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer w-fit"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-emerald-700" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Coupons</span>
            <h3 className="text-2xl font-black text-stone-900 mt-1">{coupons.length}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Ticket className="size-6" />
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Active Coupons</span>
            <h3 className="text-2xl font-black text-emerald-800 mt-1">{activeCount}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle2 className="size-6" />
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Redemptions</span>
            <h3 className="text-2xl font-black text-amber-700 mt-1">{totalUses}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Layers className="size-6" />
          </div>
        </div>
      </div>

      {/* Generator & Form */}
      <div className="bg-white border border-emerald-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-emerald-950 flex items-center gap-2">
              <Sparkles className="size-5 text-emerald-700" />
              Generate New Coupon Code
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Create a custom code or click Random to generate instantly.
            </p>
          </div>
          <button
            type="button"
            onClick={generateRandomCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition cursor-pointer"
          >
            <Dices className="size-4 text-emerald-700" />
            Random Code
          </button>
        </div>

        <form onSubmit={handleCreateCoupon} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Coupon Code Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                Coupon Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KRISH10, TULSI20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full uppercase font-mono font-bold tracking-wider px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden text-stone-900 text-sm"
              />
            </div>

            {/* Discount Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">Discount Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountType("percentage")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    discountType === "percentage"
                      ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                      : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <Percent className="size-3.5" /> Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType("flat")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    discountType === "flat"
                      ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                      : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <IndianRupee className="size-3.5" /> Flat (₹)
                </button>
              </div>
            </div>

            {/* Discount Value */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                {discountType === "percentage" ? "Discount Percentage (%)" : "Flat Discount (₹)"}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  max={discountType === "percentage" ? 100 : 100000}
                  placeholder={discountType === "percentage" ? "10" : "100"}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full font-bold px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden text-stone-900 text-sm"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                  {discountType === "percentage" ? "% OFF" : "₹ OFF"}
                </span>
              </div>
            </div>

            {/* Min Order Value */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Min Order Amount (₹) <span className="text-[11px] font-normal text-stone-400">(Optional)</span>
              </label>
              <input
                type="number"
                min={0}
                placeholder="0 (No Minimum)"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden text-stone-900 text-sm"
              />
            </div>

            {/* Max Discount Cap (for percentage) */}
            {discountType === "percentage" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800">
                  Max Discount Cap (₹) <span className="text-[11px] font-normal text-stone-400">(Optional)</span>
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 500"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden text-stone-900 text-sm"
                />
              </div>
            )}

            {/* Expiry Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Expiry Date <span className="text-[11px] font-normal text-stone-400">(Optional)</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden text-stone-900 text-sm"
              />
            </div>

            {/* Usage Limit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">
                Usage Limit <span className="text-[11px] font-normal text-stone-400">(Optional)</span>
              </label>
              <input
                type="number"
                min={1}
                placeholder="Unlimited"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden text-stone-900 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-emerald-750 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Plus className="size-4" />
              {submitting ? "Generating Coupon..." : "Create Coupon Code"}
            </button>
          </div>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-stone-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Layers className="size-5 text-emerald-700" />
            Existing Coupon Codes ({coupons.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-stone-500 font-medium flex items-center justify-center gap-2">
            <RefreshCw className="size-5 animate-spin text-emerald-700" /> Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-stone-500 space-y-2">
            <p className="font-bold text-base text-stone-800">No coupons created yet</p>
            <p className="text-xs text-stone-400">Use the generator above to create your first discount coupon.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-100 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Coupon Code</th>
                  <th className="py-3.5 px-6">Discount</th>
                  <th className="py-3.5 px-6">Min Order</th>
                  <th className="py-3.5 px-6">Redemptions</th>
                  <th className="py-3.5 px-6">Expiry</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {coupons.map((c) => {
                  const isExpired = c.expiryDate && new Date(c.expiryDate) < new Date();
                  return (
                    <tr key={c._id} className="hover:bg-stone-50/60 transition">
                      {/* Code */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            {c.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(c.code)}
                            className="p-1 text-stone-400 hover:text-stone-700 transition cursor-pointer"
                            title="Copy code"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-stone-900 text-sm">
                          {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                        </span>
                        {c.maxDiscount ? (
                          <p className="text-[10px] text-stone-400">Max: ₹{c.maxDiscount}</p>
                        ) : null}
                      </td>

                      {/* Min Order */}
                      <td className="py-4 px-6">
                        {c.minOrderAmount > 0 ? (
                          <span>₹{c.minOrderAmount}</span>
                        ) : (
                          <span className="text-stone-400">No Min</span>
                        )}
                      </td>

                      {/* Usage / Limit */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-stone-900">{c.usedCount || 0}</span>
                        <span className="text-stone-400">
                          {c.usageLimit ? ` / ${c.usageLimit}` : " uses"}
                        </span>
                      </td>

                      {/* Expiry */}
                      <td className="py-4 px-6">
                        {c.expiryDate ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-3.5 text-stone-400" />
                            <span className={isExpired ? "text-red-600 font-bold" : "text-stone-700"}>
                              {new Date(c.expiryDate).toLocaleDateString()}
                            </span>
                            {isExpired && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                                Expired
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400">Never</span>
                        )}
                      </td>

                      {/* Active Status */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(c._id, c.isActive)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                            c.isActive && !isExpired
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                          }`}
                        >
                          <span
                            className={`size-2 rounded-full ${
                              c.isActive && !isExpired ? "bg-emerald-600" : "bg-stone-400"
                            }`}
                          />
                          {c.isActive && !isExpired ? "Active" : "Disabled"}
                        </button>
                      </td>

                      {/* Delete */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteCoupon(c._id, c.code)}
                          className="p-2 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

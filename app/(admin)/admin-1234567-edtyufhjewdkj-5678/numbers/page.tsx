"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Smartphone,
  ShieldCheck,
  Coins,
  Search,
  Download,
  Copy,
  RefreshCw,
  Gift,
  ShoppingBag,
  History,
  CheckCircle2,
  XCircle,
  Eye,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminNumbersPage() {
  const [numbers, setNumbers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalNumbers: 0,
    verifiedNumbers: 0,
    spunNumbers: 0,
    totalCoinsInCirculation: 0,
    totalCoinsDistributed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<any>(null);

  const fetchNumbers = async (query = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/admin/numbers${query ? `?q=${encodeURIComponent(query)}` : ""}`
      );
      if (res.data.success) {
        setNumbers(res.data.numbers || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load numbers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNumbers(searchQuery);
  };

  const handleCopyNumbers = () => {
    const list = numbers.map((n) => n.phone).join("\n");
    navigator.clipboard.writeText(list);
    toast.success(`Copied ${numbers.length} mobile numbers to clipboard!`);
  };

  const handleExportCSV = () => {
    if (numbers.length === 0) {
      toast.error("No numbers to export");
      return;
    }

    const headers = "Phone,Verified,Spin_Completed,Coins_Balance,Total_Earned,Total_Spent,Orders_Count,Orders_Amount_INR,Registered_Date\n";
    const rows = numbers
      .map(
        (n) =>
          `"${n.phone}","${n.isPhoneVerified ? "YES" : "NO"}","${n.hasSpunWheel ? "YES" : "NO"}","${n.balance}","${n.totalEarned}","${n.totalSpent}","${n.ordersCount}","${n.ordersSpent}","${new Date(n.createdAt).toLocaleDateString()}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tulsiveda_numbers_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV export downloaded successfully!");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
            <Smartphone className="w-8 h-8 text-emerald-700" />
            Numbers & Rewards
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            All customer mobile numbers logged in, 2factor SMS OTP verified, and Spin & Win records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchNumbers(searchQuery)}
            className="p-2.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-700 shadow-xs transition cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleCopyNumbers}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Copy className="w-4 h-4" /> Copy All
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Numbers</span>
            <Smartphone className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-stone-900">
            {stats.totalNumbers.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-500 font-medium">Unique mobile logins</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>2Factor Verified</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-emerald-700">
            {stats.verifiedNumbers.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600/80 font-medium">
            {stats.totalNumbers > 0
              ? `${Math.round((stats.verifiedNumbers / stats.totalNumbers) * 100)}% verification rate`
              : "0%"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Spin & Win Spun</span>
            <Gift className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-amber-600">
            {stats.spunNumbers.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-500 font-medium">1-time spins completed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Coins</span>
            <Coins className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-yellow-600">
            🪙 {stats.totalCoinsInCirculation.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-500 font-medium">
            ₹{stats.totalCoinsInCirculation.toLocaleString()} value in wallets
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by 10-digit mobile number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-800 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                fetchNumbers("");
              }}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Numbers Table */}
      <div className="bg-white border border-stone-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Mobile Number</th>
                <th className="py-3.5 px-4">2Factor OTP</th>
                <th className="py-3.5 px-4">Spin & Win</th>
                <th className="py-3.5 px-4">Coins Balance</th>
                <th className="py-3.5 px-4">Total Earned</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading numbers database...
                  </td>
                </tr>
              ) : numbers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No mobile numbers found.
                  </td>
                </tr>
              ) : (
                numbers.map((item) => (
                  <tr key={item._id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      +91 {item.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.isPhoneVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5 text-stone-400" /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.hasSpunWheel ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                          <Gift className="w-3.5 h-3.5 text-amber-600" /> Claimed ({item.spinWonAmount || 100})
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400 font-semibold">Not Spun</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">
                      🪙 {item.balance} Coins
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-semibold">
                      +{item.totalEarned} Coins
                    </td>
                    <td className="py-3.5 px-4">
                      {item.ordersCount > 0 ? (
                        <span className="font-bold text-stone-900">
                          {item.ordersCount} ({`₹${item.ordersSpent.toLocaleString()}`})
                        </span>
                      ) : (
                        <span className="text-stone-400 text-xs font-normal">0 orders</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-500">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedWallet(item)}
                        className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                        title="View History"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History Details Modal */}
      {selectedWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">
                  Wallet History: +91 {selectedWallet.phone}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Current Balance: <span className="font-bold text-amber-600">{selectedWallet.balance} Coins</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedWallet(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {selectedWallet.history && selectedWallet.history.length > 0 ? (
                selectedWallet.history.map((tx: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-stone-800">{tx.description}</p>
                      <p className="text-[11px] text-stone-400">
                        {new Date(tx.date).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span
                      className={`font-black text-sm ${
                        tx.amount > 0 ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Coins
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-stone-400">
                  No coin transactions recorded yet.
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedWallet(null)}
              className="w-full py-2.5 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

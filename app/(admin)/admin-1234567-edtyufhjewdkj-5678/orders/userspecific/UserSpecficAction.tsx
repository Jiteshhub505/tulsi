"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Truck,
  Package,
  Printer,
  FileText,
  RefreshCw,
  XCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  X,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  image: string;
  createdAt: string;
  emailVerified: string | null;
}

interface ShiprocketDetails {
  orderId?: number;
  shipmentId?: number;
  awbCode?: string;
  courierName?: string;
  courierCompanyId?: number;
  status?: string;
  statusCode?: number;
  labelUrl?: string;
  manifestUrl?: string;
  invoiceUrl?: string;
  pickupTokenNumber?: string;
  pickupScheduledDate?: string;
  lastTrackingUpdate?: string;
  trackingHistory?: Array<{
    date?: string;
    status?: string;
    activity?: string;
    location?: string;
  }>;
}

interface Transaction {
  id: string;
  _id?: string;
  order_id: string;
  amount: number;
  currency: string;
  order_status?: string;
  created_at?: string;
  shippingDetails?: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
  paymentMethod?: string;
  couponCode?: string;
  shiprocket?: ShiprocketDetails;
}

/* ---------------- COMPONENT ---------------- */

export default function UserSpecificAction() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const orderId = searchParams.get("orderId"); // OPTIONAL

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [tx, setTx] = useState<Transaction | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Shiprocket action loading states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Tracking Modal State
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  /* ---------------- FETCH DATA ---------------- */

  const fetchData = async () => {
    if (!userId && !orderId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (userId && userId !== "null" && userId !== "undefined") params.set("userId", userId);
      if (orderId && orderId !== "null" && orderId !== "undefined") params.set("orderId", orderId);

      const res = await axios.get(
        `/api/admin/transactions/userspecific?${params.toString()}`
      );

      if (res.data.success) {
        const d = res.data.details;

        setUser(
          Array.isArray(d.userDetails) ? d.userDetails[0] : d.userDetails
        );

        const transaction = d.specificTransaction
          ? (Array.isArray(d.specificTransaction) ? d.specificTransaction[0] : d.specificTransaction)
          : (d.allTransactions?.[0] || null);

        setTx(transaction);
        setHistory(d.allTransactions || []);
        setOrderItems(d.orderItems || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, orderId]);

  /* ---------------- SHIPROCKET ACTIONS ---------------- */

  const handleSyncShiprocket = async () => {
    if (!tx) return;
    setActionLoading("sync");
    setActionMessage(null);
    try {
      const res = await axios.post("/api/admin/shiprocket/create-order", {
        orderId: tx.order_id,
      });
      if (res.data.success) {
        setActionMessage({ type: "success", text: "Order synced with Shiprocket successfully!" });
        await fetchData();
      } else {
        setActionMessage({ type: "error", text: res.data.message || "Failed to sync order" });
      }
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err?.response?.data?.message || "Error syncing to Shiprocket",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateAwb = async () => {
    if (!tx) return;
    setActionLoading("awb");
    setActionMessage(null);
    try {
      const res = await axios.post("/api/admin/shiprocket/generate-awb", {
        orderId: tx.order_id,
      });
      if (res.data.success) {
        setActionMessage({
          type: "success",
          text: `AWB Generated: ${res.data.awbCode || "Assigned"} (${res.data.courierName || "Courier Assigned"})`,
        });
        await fetchData();
      } else {
        setActionMessage({ type: "error", text: res.data.message || "Failed to generate AWB" });
      }
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err?.response?.data?.message || "Error generating AWB",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSchedulePickup = async () => {
    if (!tx) return;
    setActionLoading("pickup");
    setActionMessage(null);
    try {
      const res = await axios.post("/api/admin/shiprocket/request-pickup", {
        orderId: tx.order_id,
      });
      if (res.data.success) {
        setActionMessage({
          type: "success",
          text: `Pickup Scheduled! Token: ${res.data.pickupTokenNumber || "Confirmed"}`,
        });
        await fetchData();
      } else {
        setActionMessage({ type: "error", text: res.data.message || "Failed to schedule pickup" });
      }
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err?.response?.data?.message || "Error scheduling pickup",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadLabel = async () => {
    if (!tx) return;
    if (tx.shiprocket?.labelUrl) {
      window.open(tx.shiprocket.labelUrl, "_blank");
      return;
    }
    setActionLoading("label");
    setActionMessage(null);
    try {
      const res = await axios.post("/api/admin/shiprocket/generate-label", {
        orderId: tx.order_id,
      });
      if (res.data.success && res.data.labelUrl) {
        window.open(res.data.labelUrl, "_blank");
        await fetchData();
      } else {
        setActionMessage({ type: "error", text: res.data.message || "Failed to generate label" });
      }
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err?.response?.data?.message || "Error generating label",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!tx) return;
    if (tx.shiprocket?.invoiceUrl) {
      window.open(tx.shiprocket.invoiceUrl, "_blank");
      return;
    }
    setActionLoading("invoice");
    setActionMessage(null);
    try {
      const res = await axios.post("/api/admin/shiprocket/generate-invoice", {
        orderId: tx.order_id,
      });
      if (res.data.success && res.data.invoiceUrl) {
        window.open(res.data.invoiceUrl, "_blank");
        await fetchData();
      } else {
        setActionMessage({ type: "error", text: res.data.message || "Failed to generate invoice" });
      }
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err?.response?.data?.message || "Error generating invoice",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelShiprocket = async () => {
    if (!tx || !window.confirm("Are you sure you want to cancel this shipment in Shiprocket?")) return;
    setActionLoading("cancel");
    setActionMessage(null);
    try {
      const res = await axios.post("/api/admin/shiprocket/cancel-order", {
        orderId: tx.order_id,
      });
      if (res.data.success) {
        setActionMessage({ type: "success", text: "Shipment cancelled successfully." });
        await fetchData();
      } else {
        setActionMessage({ type: "error", text: res.data.message || "Failed to cancel shipment" });
      }
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err?.response?.data?.message || "Error cancelling shipment",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenTrackingModal = async () => {
    if (!tx) return;
    setTrackingModalOpen(true);
    setTrackingLoading(true);
    try {
      const res = await axios.get(`/api/shiprocket/track?orderId=${tx.order_id}`);
      if (res.data.success) {
        setTrackingData(res.data);
      } else {
        setTrackingData(null);
      }
    } catch (err) {
      console.error(err);
      setTrackingData(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
    }).format(amount);

  const filteredHistory = useMemo(() => {
    return history.filter(
      (t) =>
        t.order_id.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [history, search]);

  /* ---------------- GUARDS ---------------- */

  if (loading) return <div className="p-10 text-center text-stone-600 font-medium">Loading details...</div>;
  if (!tx && !user)
    return <div className="p-10 text-center text-stone-500 font-medium">Order details not found</div>;

  /* ---------------- UI ---------------- */

  const activeUser: UserDetail = user || {
    id: tx?.shippingDetails?.phone || "guest_user",
    name: tx?.shippingDetails?.fullName || "Customer",
    email: tx?.shippingDetails?.email || "customer@tulsiveda.com",
    phone: tx?.shippingDetails?.phone || "N/A",
    role: "Customer",
    image: "",
    createdAt: tx?.created_at || new Date().toISOString(),
    emailVerified: null,
  };

  const displayName = tx?.shippingDetails?.fullName || activeUser.name;
  const displayEmail = tx?.shippingDetails?.email || activeUser.email;
  const displayPhone = tx?.shippingDetails?.phone || activeUser.phone || "N/A";
  const displayAddress = tx?.shippingDetails
    ? `${tx.shippingDetails.street}, ${tx.shippingDetails.city}, ${tx.shippingDetails.state} - ${tx.shippingDetails.pinCode}`
    : null;

  const sr = tx?.shiprocket;
  const isSynced = Boolean(sr?.orderId || sr?.shipmentId);
  const hasAwb = Boolean(sr?.awbCode);
  const isPickupScheduled = Boolean(sr?.pickupTokenNumber || sr?.pickupScheduledDate);
  const isCancelled = sr?.status === "CANCELLED" || tx?.order_status === "cancelled";

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto pb-16">
      {/* ACTION ALERTS */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium transition-all ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CUSTOMER DETAILS */}
      <Card className="border-stone-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 bg-stone-50/70 border-b border-stone-150">
          <Avatar className="h-16 w-16 border border-stone-200 shadow-sm">
            <AvatarImage src={activeUser.image} />
            <AvatarFallback className="bg-emerald-700 text-white font-bold">{displayName?.[0] ?? "C"}</AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-2xl text-stone-900">{displayName}</CardTitle>
            <CardDescription className="flex gap-2 mt-1">
              <Badge variant="outline" className="capitalize bg-white border-stone-300 font-semibold text-stone-700">
                {activeUser.id === "guest_user" ? "Customer" : activeUser.role}
              </Badge>
              {activeUser.id && activeUser.id !== "guest_user" && (
                <span className="text-xs text-muted-foreground self-center">
                  ID: {activeUser.id}
                </span>
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid md:grid-cols-3 gap-6 pt-5">
          <Info icon={<Mail className="w-4 h-4 text-emerald-700" />} label="Email" value={displayEmail} />
          <Info icon={<Phone className="w-4 h-4 text-emerald-700" />} label="Phone" value={displayPhone} />
          {displayAddress ? (
            <Info
              icon={<MapPin className="w-4 h-4 text-emerald-700" />}
              label="Shipping Address"
              value={displayAddress}
            />
          ) : (
            <Info
              icon={<Calendar className="w-4 h-4 text-emerald-700" />}
              label="Joined"
              value={activeUser.createdAt ? format(new Date(activeUser.createdAt), "PPP") : "N/A"}
            />
          )}
        </CardContent>
      </Card>

      {/* ORDER OVERVIEW */}
      {tx && (
        <Card className="border-stone-200 shadow-sm">
          <CardHeader className="bg-stone-50 border-b border-stone-150">
            <CardTitle className="text-stone-850 flex items-center justify-between">
              <span>Order Details</span>
              <span className="text-xs font-mono font-normal text-stone-500">
                Created: {tx.created_at ? format(new Date(tx.created_at), "PPp") : "Recent"}
              </span>
            </CardTitle>
            <CardDescription>Details for order #{tx.order_id}</CardDescription>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <Field label="Order ID" value={tx.order_id} mono />
            <Field
              label="Amount to Pay"
              value={formatCurrency(tx.amount, tx.currency)}
              big
            />
            <div>
              <p className="text-sm text-muted-foreground">Order Status</p>
              <div className="mt-1">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${
                    tx.order_status === "paid"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : tx.order_status === "created"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : tx.order_status === "cancelled"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {tx.order_status === "created" ? "Order Placed" : tx.order_status}
                </span>
              </div>
            </div>
            {tx.paymentMethod && (
              <Field
                label="Payment Method"
                value={tx.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay Secure"}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* SHIPROCKET FULFILLMENT & SHIPPING CONTROL CARD */}
      {tx && (
        <Card className="border-emerald-200/80 shadow-md bg-gradient-to-br from-white to-emerald-50/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Truck className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white font-bold flex items-center gap-2">
                    Shiprocket Fulfillment
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 font-medium">
                      Logistics API
                    </span>
                  </CardTitle>
                  <CardDescription className="text-emerald-100/80 text-xs">
                    Manage AWB, courier partners, pickups, labels & live tracking
                  </CardDescription>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                <span
                  className={`px-3.5 py-1 text-xs font-bold rounded-full border tracking-wide uppercase shadow-sm ${
                    !isSynced
                      ? "bg-amber-400 text-amber-950 border-amber-300"
                      : isCancelled
                      ? "bg-rose-500 text-white border-rose-400"
                      : sr?.status === "DELIVERED"
                      ? "bg-emerald-400 text-emerald-950 border-emerald-300"
                      : hasAwb
                      ? "bg-blue-400 text-blue-950 border-blue-300"
                      : "bg-white text-emerald-900 border-white/40"
                  }`}
                >
                  {sr?.status || (isSynced ? "Order Synced" : "Not Synced")}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
              <div>
                <p className="text-xs text-stone-500 font-medium">Shiprocket Order ID</p>
                <p className="text-sm font-semibold font-mono text-stone-800 mt-0.5">
                  {sr?.orderId || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Shipment ID</p>
                <p className="text-sm font-semibold font-mono text-stone-800 mt-0.5">
                  {sr?.shipmentId || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Courier Partner</p>
                <p className="text-sm font-semibold text-emerald-800 mt-0.5">
                  {sr?.courierName || "Not Assigned"}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">AWB Tracking Code</p>
                <p className="text-sm font-bold font-mono text-stone-900 mt-0.5 flex items-center gap-1.5">
                  {sr?.awbCode ? (
                    <>
                      <span>{sr.awbCode}</span>
                      <a
                        href={`https://shiprocket.co//tracking/${sr.awbCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-900"
                        title="Direct Track"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>

              {sr?.pickupTokenNumber && (
                <div>
                  <p className="text-xs text-stone-500 font-medium">Pickup Token</p>
                  <p className="text-xs font-mono font-semibold text-stone-800 mt-0.5">
                    {sr.pickupTokenNumber}
                  </p>
                </div>
              )}

              {sr?.pickupScheduledDate && (
                <div>
                  <p className="text-xs text-stone-500 font-medium">Pickup Date</p>
                  <p className="text-xs font-semibold text-stone-800 mt-0.5">
                    {sr.pickupScheduledDate}
                  </p>
                </div>
              )}

              {sr?.lastTrackingUpdate && (
                <div className="col-span-2">
                  <p className="text-xs text-stone-500 font-medium">Last Synced</p>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {format(new Date(sr.lastTrackingUpdate), "PPpp")}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!isSynced && (
                <button
                  onClick={handleSyncShiprocket}
                  disabled={actionLoading === "sync"}
                  className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Package className={`w-4 h-4 ${actionLoading === "sync" ? "animate-spin" : ""}`} />
                  {actionLoading === "sync" ? "Syncing..." : "Sync Order to Shiprocket"}
                </button>
              )}

              {isSynced && !hasAwb && !isCancelled && (
                <button
                  onClick={handleGenerateAwb}
                  disabled={actionLoading === "awb"}
                  className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Truck className={`w-4 h-4 ${actionLoading === "awb" ? "animate-bounce" : ""}`} />
                  {actionLoading === "awb" ? "Generating AWB..." : "Assign Courier & Generate AWB"}
                </button>
              )}

              {isSynced && hasAwb && !isPickupScheduled && !isCancelled && (
                <button
                  onClick={handleSchedulePickup}
                  disabled={actionLoading === "pickup"}
                  className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  {actionLoading === "pickup" ? "Scheduling..." : "Schedule Courier Pickup"}
                </button>
              )}

              {isSynced && hasAwb && (
                <>
                  <button
                    onClick={handleDownloadLabel}
                    disabled={actionLoading === "label"}
                    className="px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-emerald-700" />
                    {actionLoading === "label" ? "Fetching Label..." : "Shipping Label PDF"}
                  </button>

                  <button
                    onClick={handleDownloadInvoice}
                    disabled={actionLoading === "invoice"}
                    className="px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-700" />
                    {actionLoading === "invoice" ? "Fetching Invoice..." : "Tax Invoice PDF"}
                  </button>
                </>
              )}

              {isSynced && (
                <button
                  onClick={handleOpenTrackingModal}
                  className="px-3.5 py-2.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-700" />
                  Live Tracking Timeline
                </button>
              )}

              {isSynced && !isCancelled && sr?.status !== "DELIVERED" && (
                <button
                  onClick={handleCancelShiprocket}
                  disabled={actionLoading === "cancel"}
                  className="px-3 py-2.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-sm flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Cancel Shipment
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ITEMS PURCHASED */}
      {tx && orderItems.length > 0 && (
        <Card className="border-stone-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-stone-50 border-b border-stone-150">
            <CardTitle className="text-stone-850">Items Purchased</CardTitle>
            <CardDescription>Products included in this order</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Product</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right pr-6">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-stone-50/30 transition-colors">
                    <TableCell className="pl-6 flex items-center gap-3">
                      {item.image && (
                        <div className="w-12 h-12 bg-white rounded border overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img src={item.image} className="max-w-full max-h-full object-contain" alt="" />
                        </div>
                      )}
                      <span className="font-semibold text-stone-900">{item.name}</span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-stone-800">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right font-medium text-stone-750">
                      ₹{Number(item.price).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-800 pr-6">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* TRANSACTION HISTORY */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Transaction History</CardTitle>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Search Order / System ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Badge variant="secondary">
                {filteredHistory.length} Records
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>System ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredHistory.map((item) => {
                const itemId = item._id || item.id;
                const txId = tx?._id || tx?.id;
                const isCurrent = itemId === txId;

                return (
                  <TableRow
                    key={itemId}
                    className={isCurrent ? "bg-stone-50" : ""}
                  >
                    <TableCell className="font-mono text-stone-850">
                      {item.order_id}
                      {isCurrent && (
                        <Badge
                          variant="outline"
                          className="ml-2 text-xs border-stone-300 text-stone-600"
                        >
                          Current
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-stone-500">{itemId}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.amount, item.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                          item.order_status === "paid"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : item.order_status === "created"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : item.order_status === "cancelled"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {item.order_status === "created" ? "Order Placed" : item.order_status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* TRACKING TIMELINE MODAL */}
      {trackingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-emerald-200" />
                <div>
                  <h3 className="text-lg font-bold">Shipment Live Tracking</h3>
                  <p className="text-xs text-emerald-100">
                    Order #{tx?.order_id} • AWB: {sr?.awbCode || "N/A"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTrackingModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {trackingLoading ? (
                <div className="py-12 text-center text-stone-500 font-medium">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-emerald-700 mb-2" />
                  Fetching real-time tracking updates...
                </div>
              ) : (
                <>
                  {/* Current Status Card */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
                        Current Status
                      </span>
                      <h4 className="text-lg font-bold text-emerald-950 mt-0.5">
                        {trackingData?.currentStatus || sr?.status || "In Process"}
                      </h4>
                      {trackingData?.courierName && (
                        <p className="text-xs text-stone-600 mt-0.5">
                          Carrier: <strong className="text-stone-800">{trackingData.courierName}</strong>
                        </p>
                      )}
                    </div>

                    {trackingData?.etd && (
                      <div className="text-right">
                        <span className="text-xs text-stone-500 font-medium flex items-center gap-1 justify-end">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" /> Expected Delivery
                        </span>
                        <p className="text-sm font-bold text-emerald-900">{trackingData.etd}</p>
                      </div>
                    )}
                  </div>

                  {/* Tracking Timeline */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-bold text-stone-800 uppercase tracking-wide">
                      Checkpoint History
                    </h5>

                    {trackingData?.trackingHistory && trackingData.trackingHistory.length > 0 ? (
                      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                        {trackingData.trackingHistory.map((step: any, idx: number) => (
                          <div key={idx} className="relative">
                            <div
                              className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white ${
                                idx === 0
                                  ? "border-emerald-600 bg-emerald-600 ring-4 ring-emerald-100"
                                  : "border-stone-400"
                              }`}
                            />
                            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
                              <div className="flex justify-between items-start gap-2">
                                <p className="font-semibold text-stone-900 text-sm">{step.activity || step.status}</p>
                                <span className="text-xs text-stone-500 whitespace-nowrap font-medium">{step.date}</span>
                              </div>
                              {step.location && (
                                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-stone-400" />
                                  {step.location}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : sr?.trackingHistory && sr.trackingHistory.length > 0 ? (
                      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                        {sr.trackingHistory.map((step: any, idx: number) => (
                          <div key={idx} className="relative">
                            <div
                              className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white ${
                                idx === 0
                                  ? "border-emerald-600 bg-emerald-600 ring-4 ring-emerald-100"
                                  : "border-stone-400"
                              }`}
                            />
                            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
                              <div className="flex justify-between items-start gap-2">
                                <p className="font-semibold text-stone-900 text-sm">{step.activity || step.status}</p>
                                <span className="text-xs text-stone-500 whitespace-nowrap font-medium">{step.date}</span>
                              </div>
                              {step.location && (
                                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-stone-400" />
                                  {step.location}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-stone-500 bg-stone-50 rounded-xl border border-stone-200 text-sm">
                        No scan events recorded yet. Check back shortly as the courier picks up and scans the package.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              {sr?.awbCode ? (
                <a
                  href={`https://shiprocket.co//tracking/${sr.awbCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  Open Shiprocket Tracking Portal <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <div />
              )}

              <button
                onClick={() => setTrackingModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

const Info = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-stone-900">{value}</p>
    </div>
  </div>
);

const Field = ({
  label,
  value,
  mono,
  big,
  danger,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  big?: boolean;
  danger?: boolean;
}) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p
      className={[
        "text-stone-900 mt-0.5",
        mono && "font-mono font-semibold",
        big && "text-2xl font-bold text-emerald-800",
        danger && "text-red-600 font-medium",
        !big && !mono && "font-semibold text-sm",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {value ?? "N/A"}
    </p>
  </div>
);

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Truck, MapPin, Clock, ExternalLink, X, RefreshCw, CheckCircle2 } from "lucide-react";
import axios from "axios";

type ShiprocketData = {
  orderId?: number;
  shipmentId?: number;
  awbCode?: string;
  courierName?: string;
  status?: string;
  labelUrl?: string;
  trackingHistory?: Array<{
    date?: string;
    status?: string;
    activity?: string;
    location?: string;
  }>;
};

type OrderRow = {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  shiprocket?: ShiprocketData | null;
  createdAt: string;
  productId: string | null;
  productName: string | null;
  productImage: string[] | null;
  price: number | null;
  quantity: number | null;
};

type GroupedOrder = {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  shiprocket?: ShiprocketData | null;
  createdAt: string;
  items: {
    productId: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }[];
};

export default function OrdersList() {
  const [orders, setOrders] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);

  // Tracking Modal State
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<GroupedOrder | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("tulsi_user_phone") : null;
    if (savedPhone && savedPhone.length === 10) {
      setUserPhone(savedPhone);
      axios
        .get(`/api/rewards/wallet?phone=${savedPhone}`)
        .then((res) => {
          if (res.data?.success && res.data.wallet) {
            setWallet(res.data.wallet);
          }
        })
        .catch(() => {});
    }

    const orderUrl = savedPhone
      ? `/api/userprofile/getorders?phone=${savedPhone}`
      : "/api/userprofile/getorders";

    fetch(orderUrl)
      .then((res) => res.json())
      .then((data: OrderRow[]) => {
        const grouped = Object.values(
          (Array.isArray(data) ? data : []).reduce<Record<string, GroupedOrder>>((acc, row) => {
            if (!acc[row.orderId]) {
              acc[row.orderId] = {
                orderId: row.orderId,
                amount: row.amount,
                currency: row.currency,
                status: row.status,
                shiprocket: row.shiprocket || null,
                createdAt: row.createdAt,
                items: [],
              };
            }
            if (
              row.productId &&
              row.productName &&
              row.price !== null &&
              row.quantity !== null
            ) {
              acc[row.orderId].items.push({
                productId: row.productId,
                name: row.productName,
                image: row.productImage?.[0],
                price: row.price,
                quantity: row.quantity,
              });
            }
            return acc;
          }, {})
        );
        setOrders(grouped);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100";
      case "failed":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const handleTrackPackage = async (order: GroupedOrder) => {
    setSelectedOrder(order);
    setTrackingModalOpen(true);
    setTrackingLoading(true);
    try {
      const res = await axios.get(`/api/shiprocket/track?orderId=${order.orderId}`);
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      {/* Profile & Tulsi Coins Summary Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-700/50">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/20">
            🌿
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">My Profile</h2>
            <p className="text-xs text-emerald-200 font-semibold mt-0.5">
              {userPhone ? `+91 ${userPhone} • Verified Customer` : "Logged in User"}
            </p>
          </div>
        </div>

        {/* Coins Balance Box */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
              Tulsi Coins Balance
            </span>
            <span className="text-2xl font-black text-amber-300 flex items-center gap-1.5">
              🪙 {wallet?.balance || 0} Coins
            </span>
          </div>
          <div className="border-l border-white/20 pl-4 text-xs space-y-0.5">
            <p className="text-emerald-100 font-semibold">Value: <strong className="text-white">₹{wallet?.balance || 0} Off</strong></p>
            <p className="text-[11px] text-emerald-200 font-medium">Earned: +{wallet?.totalEarned || 0}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground font-medium flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-700" /> Loading your orders...
        </div>
      ) : !orders.length ? (
        <div className="p-12 text-center border border-dashed border-stone-300 rounded-2xl text-stone-500 bg-stone-50 space-y-2">
          <p className="font-bold text-lg text-stone-800">No orders found</p>
          <p className="text-xs text-stone-500">Your placed orders will appear here in real-time with tracking.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const sr = order.shiprocket;
            const hasAwb = Boolean(sr?.awbCode);
            const srStatus = sr?.status || (hasAwb ? "In Transit" : "Processing");

        return (
          <Card
            key={order.orderId}
            className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-stone-200"
          >
            <CardHeader className="flex flex-row items-center justify-between bg-stone-50/70 py-3.5 border-b border-stone-150">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-mono text-stone-700 font-bold uppercase">
                    #{order.orderId}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`${getStatusStyles(order.status)} capitalize px-2.5 py-0.5 text-xs font-semibold`}
                  >
                    {order.status === "created" ? "Order Placed" : order.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Placed on {format(new Date(order.createdAt), "PPP")}
                </p>
              </div>

              {/* Shipping Badge / Track Action */}
              <div className="flex items-center gap-2">
                {sr?.courierName && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Truck className="w-3.5 h-3.5" />
                    {sr.courierName}
                  </span>
                )}
                {hasAwb && (
                  <button
                    onClick={() => handleTrackPackage(order)}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Track Package
                  </button>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 text-sm"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-slate-50 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-muted-foreground text-xs">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}

              <Separator className="my-2" />

              <div className="flex flex-wrap justify-between items-center pt-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">
                    {sr?.status ? (
                      <strong className="text-emerald-800 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                        Status: {sr.status}
                      </strong>
                    ) : (
                      "Order is being prepared for fulfillment"
                    )}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-muted-foreground text-xs font-medium mr-2">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-emerald-800">
                    ₹{new Intl.NumberFormat("en-IN").format(order.amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )}

      {/* TRACKING TIMELINE MODAL */}
      {trackingModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-emerald-200" />
                <div>
                  <h3 className="text-lg font-bold">Track Shipment</h3>
                  <p className="text-xs text-emerald-100">
                    Order #{selectedOrder.orderId} • AWB: {selectedOrder.shiprocket?.awbCode || "N/A"}
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

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {trackingLoading ? (
                <div className="py-12 text-center text-stone-500 font-medium">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-emerald-700 mb-2" />
                  Fetching live tracking from courier...
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">
                        Current Status
                      </span>
                      <h4 className="text-lg font-bold text-emerald-950 mt-0.5">
                        {trackingData?.currentStatus || selectedOrder.shiprocket?.status || "In Transit"}
                      </h4>
                      {trackingData?.courierName && (
                        <p className="text-xs text-stone-600 mt-0.5">
                          Carrier: <strong>{trackingData.courierName}</strong>
                        </p>
                      )}
                    </div>

                    {trackingData?.etd && (
                      <div className="text-right">
                        <span className="text-xs text-stone-500 font-medium flex items-center gap-1 justify-end">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" /> Est. Delivery
                        </span>
                        <p className="text-sm font-bold text-emerald-900">{trackingData.etd}</p>
                      </div>
                    )}
                  </div>

                  {/* Journey Checkpoints */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Tracking History
                    </h5>

                    {trackingData?.trackingHistory && trackingData.trackingHistory.length > 0 ? (
                      <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                        {trackingData.trackingHistory.map((step: any, idx: number) => (
                          <div key={idx} className="relative">
                            <div
                              className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white ${
                                idx === 0
                                  ? "border-emerald-600 bg-emerald-600 ring-4 ring-emerald-100"
                                  : "border-stone-400"
                              }`}
                            />
                            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/80">
                              <div className="flex justify-between items-start gap-2">
                                <p className="font-semibold text-stone-900 text-sm">{step.activity || step.status}</p>
                                <span className="text-xs text-stone-500 whitespace-nowrap">{step.date}</span>
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
                      <div className="p-6 text-center text-stone-500 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                        Package dispatched with courier. Scan updates will appear here in real time.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              {selectedOrder.shiprocket?.awbCode ? (
                <a
                  href={`https://shiprocket.co//tracking/${selectedOrder.shiprocket.awbCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  Full Courier Tracking <ExternalLink className="w-3.5 h-3.5" />
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

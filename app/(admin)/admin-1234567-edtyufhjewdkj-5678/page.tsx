"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, XCircle, ShoppingCart, Download, ReceiptIndianRupee } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import axios from "axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { exportPDF } from "@/lib/admin/export/pdf";
import { Logo } from "@/components/logo";

type MonthlyData = { month: string; total: number };
type Stats = {
  totalAmount: number;
  totalOrders: number;
  failedPayments: number;
  cancelledOrders: number;
  createdOrders: number;
  monthlyRevenue: MonthlyData[];
};

export type Order = {
  id: string;
  _id?: string;
  order_id: string;
  user_id: string;
  amount: number;
  order_status: string;
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
};

const fetchStats = async (): Promise<Stats> => {
  const res = await axios.get("/api/admin/stats");
  if (!res.data.success) throw new Error("Stats fetch failed");
  return res.data.stats;
};

const fetchOrders = async (): Promise<Order[]> => {
  const res = await axios.get("/api/admin/getorders?limit=5&page=1&statusFilter=ALL");
  if (!res.data.success) throw new Error("Orders fetch failed");
  return res.data.recentOrders;
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery<Stats>({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
  });

  const { data: orders = [], isLoading: ordersLoading, isError: ordersError } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
    staleTime: 60_000,
  });

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-lg animate-pulse text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (statsError || ordersError || !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-destructive">Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  const totalOrdersCount = Number(stats.totalOrders) || 0;
  const failedCount = Number(stats.failedPayments) || 0;
  const cancelledCount = Number(stats.cancelledOrders) || 0;
  const createdCount = Number(stats.createdOrders) || 0;
  const successfulPayments = Math.max(totalOrdersCount - failedCount - cancelledCount - createdCount, 0);

  const statsCards = [
    { title: "Paid Orders Value", value: `₹${Number(stats.totalAmount).toLocaleString("en-IN")}`, icon: ReceiptIndianRupee, tint: "bg-emerald-50 text-emerald-600" },
    { title: "Total Orders", value: totalOrdersCount, icon: ShoppingCart, tint: "bg-blue-50 text-blue-600" },
    { title: "Total Paid Orders", value: successfulPayments, icon: ReceiptIndianRupee, tint: "bg-emerald-50 text-emerald-600" },
    { title: "Failed Payments", value: failedCount, icon: XCircle, tint: "bg-red-50 text-red-600" },
    { title: "Cancelled Orders", value: cancelledCount, icon: CreditCard, tint: "bg-amber-50 text-amber-600" },
    { title: "Pending Orders", value: createdCount, icon: CreditCard, tint: "bg-slate-100 text-slate-600" },
  ];

  const paymentStatusData = [
    { name: "Successful", value: successfulPayments, color: "#10b981" },
    { name: "Failed", value: failedCount, color: "#ef4444" },
    { name: "Cancelled", value: cancelledCount, color: "#64748b" },
  ].filter((i) => i.value > 0);

  const hasRevenueData = stats.monthlyRevenue?.length > 0;
  const hasPaymentData = paymentStatusData.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <Logo className="h-7" />
          <Button onClick={exportPDF} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </header>

      <main id="admin-report" className="pdf-safe px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-1 text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mb-6">A quick look at how the store is performing.</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {statsCards.map((s) => (
            <Card key={s.title} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 py-2">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tint}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.title}</p>
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-7 mb-8">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue Growth</CardTitle>
              <p className="text-sm text-muted-foreground">Last few months' performance</p>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                {hasRevenueData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short" })}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip
                        labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        formatter={(value) => [`₹${value}`, "Revenue"]}
                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      />
                      <Area type="monotone" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No revenue yet — it&apos;ll show up here once orders start coming in.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Payment Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                {hasPaymentData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={paymentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} stroke="none">
                        {paymentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No orders yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/admin-1234567-edtyufhjewdkj-5678/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No recent orders found.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id || order.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition">
                  <div className="space-y-1">
                    <p className="font-semibold leading-none">{order.order_id}</p>
                    <p className="text-xs text-muted-foreground">Customer: {order.shippingDetails?.fullName || "Customer"}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium text-sm">₹{Number(order.amount).toFixed(2)}</p>
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {order.order_status === "created" ? "Order Placed" : order.order_status}
                      </Badge>
                    </div>
                    <Link href={`/admin-1234567-edtyufhjewdkj-5678/orders/userspecific?userId=${order.user_id}&orderId=${order.order_id}`}>
                      <Button size="sm" variant="outline">Details</Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

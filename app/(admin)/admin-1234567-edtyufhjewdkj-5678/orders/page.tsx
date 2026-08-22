"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Order } from "../page";

const LIMIT = 10;

const Page = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const statusStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-700 border-green-200",
    created: "bg-blue-105 text-blue-700 border-blue-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    failed: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const handleDeleteOrder = async (orderId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Are you sure you want to permanently delete order #${orderId}?`)) return;
    try {
      const res = await axios.delete(`/api/admin/orders/delete?orderId=${orderId}`);
      if (res.data.success) {
        setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
      }
    } catch (err) {
      alert("Failed to delete order");
    }
  };

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "paid" | "created" | "failed" | "cancelled"
  >("ALL");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/admin/getorders?page=${page}&limit=${LIMIT}&statusFilter=${statusFilter}&sort=${sortOrder}`,
        );

        if (res.data.success) {
          setOrders(res.data.recentOrders);
          setTotalPages(res.data.meta.totalPages);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, statusFilter, sortOrder]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold">Orders</h2>

        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="border rounded-md px-3 py-1 text-sm font-semibold cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="created">Order Placed</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as "asc" | "desc");
              setPage(1);
            }}
            className="border rounded-md px-3 py-1 text-sm font-semibold"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading && (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {!loading && orders?.length === 0 && (
            <p className="text-sm text-muted-foreground font-semibold p-6">No orders found</p>
          )}

          {!loading && orders && orders.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const sr = order.shiprocket;
                  const isSynced = Boolean(sr?.orderId || sr?.shipmentId);
                  const hasAwb = Boolean(sr?.awbCode);

                  return (
                    <TableRow key={order._id || order.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-semibold text-stone-905">{order.order_id}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-stone-850">
                          {order.shippingDetails?.fullName || "Customer"}
                        </div>
                        {order.shippingDetails?.email && (
                          <div className="text-xs text-stone-500 font-normal">
                            {order.shippingDetails.email}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-bold text-emerald-800">
                        ₹{Number(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${
                            statusStyles[order.order_status] ?? "bg-stone-100 text-stone-605 border-stone-200"
                          }`}
                        >
                          {order.order_status === "created" ? "Order Placed" : order.order_status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {sr?.status ? (
                          <div className="space-y-0.5">
                            <span
                              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border uppercase tracking-wider ${
                                sr.status === "DELIVERED"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : hasAwb
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-amber-100 text-amber-800 border-amber-200"
                              }`}
                            >
                              {sr.status}
                            </span>
                            {sr.courierName && (
                              <p className="text-[11px] text-stone-500 font-medium">
                                {sr.courierName}
                              </p>
                            )}
                          </div>
                        ) : isSynced ? (
                          <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-stone-100 text-stone-600 border border-stone-200">
                            Synced
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400 font-medium">
                            Not Synced
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin-1234567-edtyufhjewdkj-5678/orders/userspecific?userId=${order.user_id}&orderId=${order.order_id}`}>
                            <button className="text-xs font-semibold px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition cursor-pointer">
                              Manage
                            </button>
                          </Link>
                          <button
                            onClick={(e) => handleDeleteOrder(order.order_id, e)}
                            className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 2), page + 1)
              .map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && setPage(page + 1)}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Page;

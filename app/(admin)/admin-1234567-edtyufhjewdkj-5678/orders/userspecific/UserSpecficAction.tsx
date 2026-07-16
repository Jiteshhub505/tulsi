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

import { Mail, Phone, Calendar, CreditCard } from "lucide-react";

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

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/admin/transactions/userspecific?userId=${userId}&orderId=${orderId ?? ""}`,
        );

        if (res.data.success) {
          const d = res.data.details;

          setUser(
            Array.isArray(d.userDetails) ? d.userDetails[0] : d.userDetails,
          );

          setTx(
            d.specificTransaction
              ? Array.isArray(d.specificTransaction)
                ? d.specificTransaction[0]
                : d.specificTransaction
              : null,
          );

          setHistory(d.allTransactions || []);
          setOrderItems(d.orderItems || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, orderId]);

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
        t.id.toLowerCase().includes(search.toLowerCase()),
    );
  }, [history, search]);

  /* ---------------- GUARDS ---------------- */

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user)
    return <div className="p-10 text-center text-red-500">User not found</div>;

  /* ---------------- UI ---------------- */

  const displayName = tx?.shippingDetails?.fullName || user.name;
  const displayEmail = tx?.shippingDetails?.email || user.email;
  const displayPhone = tx?.shippingDetails?.phone || user.phone || "N/A";
  const displayAddress = tx?.shippingDetails 
    ? `${tx.shippingDetails.street}, ${tx.shippingDetails.city}, ${tx.shippingDetails.state} - ${tx.shippingDetails.pinCode}`
    : null;

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* CUSTOMER DETAILS */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image} />
            <AvatarFallback>{displayName?.[0] ?? "C"}</AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-2xl">{displayName}</CardTitle>
            <CardDescription className="flex gap-2 mt-1">
              <Badge variant="outline" className="capitalize">
                {user.id === "guest_user" ? "Walk-in Customer" : user.role}
              </Badge>
              {user.id !== "guest_user" && (
                <span className="text-xs text-muted-foreground">
                  ID: {user.id}
                </span>
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="grid md:grid-cols-3 gap-6 pt-4">
          <Info icon={<Mail />} label="Email" value={displayEmail} />
          <Info icon={<Phone />} label="Phone" value={displayPhone} />
          {displayAddress ? (
            <Info 
              icon={
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              } 
              label="Shipping Address" 
              value={displayAddress} 
            />
          ) : (
            <Info
              icon={<Calendar />}
              label="Joined"
              value={format(new Date(user.createdAt), "PPP")}
            />
          )}
        </CardContent>
      </Card>

      {/* SPECIFIC TRANSACTION (ONLY IF orderId EXISTS) */}
      {tx && (
        <Card className="border-stone-200 shadow-sm">
          <CardHeader className="bg-stone-50 border-b border-stone-150">
            <CardTitle className="text-stone-850">Order Details</CardTitle>
            <CardDescription>Details for order {tx.order_id}</CardDescription>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
            <Field label="Order ID" value={tx.order_id} mono />
            <Field
              label="Amount to Pay"
              value={formatCurrency(tx.amount, tx.currency)}
              big
            />
            <Field label="System ID" value={tx.id} mono />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <div>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${
                    tx.order_status === "paid"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : tx.order_status === "created"
                      ? "bg-blue-105 text-blue-700 border-blue-200"
                      : tx.order_status === "cancelled"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-yellow-105 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {tx.order_status === "created" ? "Order Placed" : tx.order_status}
                </span>
              </div>
            </div>
            {tx.paymentMethod && (
              <Field label="Payment Method" value={tx.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay Secure"} />
            )}
            {tx.couponCode && (
              <Field label="Coupon Code Applied" value={tx.couponCode} />
            )}
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
                            ? "bg-green-105 text-green-700 border-green-200"
                            : item.order_status === "created"
                            ? "bg-blue-105 text-blue-700 border-blue-200"
                            : item.order_status === "cancelled"
                            ? "bg-red-105 text-red-700 border-red-200"
                            : "bg-yellow-105 text-yellow-700 border-yellow-200"
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
                  <TableCell colSpan={3} className="text-center py-6">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
    <div className="p-2 bg-muted rounded">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
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
    <p className="text-sm text-muted-foreground">{label}</p>
    <p
      className={[
        mono && "font-mono",
        big && "text-2xl font-bold",
        danger && "text-red-600 font-medium",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {value ?? "N/A"}
    </p>
  </div>
);

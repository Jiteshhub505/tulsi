"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

type PlaceOrderButtonProps = {
  /** When provided, places an order for just this product ("Buy Now"). */
  productId?: string;
  variant?: "default" | "outline";
  onSuccess?: () => void;
  className?: string;
};

/**
 * Replaces the old Razorpay-backed PayButton. There is no payment gateway
 * wired up right now, so this simply places the order directly (marked as
 * "paid") against the local database. Swap the endpoint/logic here once a
 * real payment provider is added back.
 */
export default function PlaceOrderButton({
  productId,
  variant = "default",
  onSuccess,
  className,
}: PlaceOrderButtonProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    try {
      setError("");
      setLoading(true);

      const { data } = productId
        ? await axios.post(`/api/orders/place-single?productId=${productId}`)
        : await axios.post("/api/orders/place-cart");

      if (!data?.success) {
        throw new Error(data?.message || "Order creation failed");
      }

      alert("Order placed successfully!");
      onSuccess?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={placeOrder}
        variant={variant}
        className={className || "w-full"}
        disabled={loading}
      >
        {loading ? "Placing order..." : productId ? "BUY NOW" : "PLACE ORDER"}
      </Button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </>
  );
}

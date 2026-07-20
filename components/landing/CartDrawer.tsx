"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, Loader2, ShoppingBag } from "lucide-react";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import PlaceOrderButton from "@/components/payment/PlaceOrderButton";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type ProductType = {
  cartItemId: string;
  discountPrice: number;
  image: string[];
  name: string;
  price: number;
  productId: number;
  quantity: number;
};

export default function CartDrawer() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart/fetchcart");
      if (response.data.success) {
        setProducts(response.data.items);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    window.addEventListener("cart-updated", fetchCart);
    return () => window.removeEventListener("cart-updated", fetchCart);
  }, []);

  const updateQuantity = async (
    productId: number,
    productQuantity: number,
    cartItemId: string
  ) => {
    const response = await axios.put("/api/cart/updatequantity", {
      cartItemId,
      productId,
      productQuantity,
    });

    if (response.data.success) {
      console.log("Updated quantity in DB");
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      console.log("Failed to update quantity");
    }
  };

  const debouncedServer = useDebouncedCallback(updateQuantity, 1000);

  const decreaseQuantity = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.productId !== productId) return p;
        if (p.quantity > 1) {
          const updated = p.quantity - 1;
          debouncedServer(p.productId, updated, p.cartItemId);
          return { ...p, quantity: updated };
        }
        return p;
      })
    );
  };

  const increaseQuantity = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.productId !== productId) return p;
        const updated = p.quantity + 1;
        debouncedServer(p.productId, updated, p.cartItemId);
        return { ...p, quantity: updated };
      })
    );
  };

  const removeItem = async (productId: number, cartItemId: string) => {
    setProducts((prev) => prev.filter((p) => p.productId !== productId));
    try {
      const response = await axios.delete("/api/cart/deletecart", {
        data: { cartItemId, productId },
      });
      if (response.data.success) {
        console.log("Removed from DB");
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const subtotal = products.reduce((sum, p) => {
    const unitPrice = p.discountPrice ?? p.price;
    return sum + unitPrice * p.quantity;
  }, 0);

  const total = subtotal;

  return (
    <SheetContent className="flex flex-col h-full w-full sm:w-[400px] md:w-[480px] p-5 sm:p-6 bg-white dark:bg-zinc-950 border-l border-zinc-150 dark:border-zinc-800">
      <SheetHeader className="pb-3 sm:pb-4">
        <SheetTitle className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
          <ShoppingBag className="size-5 text-emerald-700" />
          Your Cart
          {products.length > 0 && (
            <span className="ml-auto text-sm font-medium text-zinc-500">{products.length} item{products.length > 1 ? 's' : ''}</span>
          )}
        </SheetTitle>
      </SheetHeader>
      <Separator />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin size-8 text-emerald-700" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="rounded-full bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800">
            <ShoppingBag className="size-8 text-zinc-400" />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg">Your cart is empty</h3>
          <p className="text-zinc-500 text-sm max-w-[240px]">
            Add some premium Ayurvedic supplements to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Scrollable list of items */}
          <div className="flex-1 overflow-y-auto pr-1 py-3 sm:py-4 space-y-3 sm:space-y-4">
            {products.map((p, i) => {
              const price = p.discountPrice ?? p.price;
              return (
                <div
                  key={i}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-3.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 items-start relative group"
                >
                  <div className="size-20 sm:size-20 bg-white dark:bg-zinc-800 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 shrink-0">
                    <img
                      src={p.image[0]}
                      alt={p.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm line-clamp-2 leading-snug">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-zinc-900 dark:text-zinc-50 font-bold text-base">
                        ₹{price}
                      </span>
                      {p.discountPrice && (
                        <span className="line-through text-zinc-400 text-xs">
                          ₹{p.price}
                        </span>
                      )}
                    </div>

                    {/* Qty Controls — large touch targets */}
                    <div className="flex items-center mt-3 border border-zinc-200 dark:border-zinc-700 rounded-lg w-fit bg-white dark:bg-zinc-800">
                      <button
                        onClick={() => decreaseQuantity(p.productId)}
                        className="py-2 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors rounded-l-lg cursor-pointer active:bg-zinc-200"
                        disabled={p.quantity <= 1}
                      >
                        <Minus className="size-3.5 text-zinc-600 dark:text-zinc-300" />
                      </button>
                      <span className="text-zinc-800 dark:text-zinc-200 px-4 text-sm font-bold">
                        {p.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(p.productId)}
                        className="py-2 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors rounded-r-lg cursor-pointer active:bg-zinc-200"
                      >
                        <Plus className="size-3.5 text-zinc-600 dark:text-zinc-300" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(p.productId, p.cartItemId)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Cart Summary & Checkout */}
          <div className="pt-4 space-y-4 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
            <div className="space-y-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-900 dark:text-zinc-50 font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-700 font-semibold">Calculated at checkout</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base text-zinc-900 dark:text-zinc-50 font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/cart?checkout=true" className="w-full">
                <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-6 rounded-xl transition-all shadow-md cursor-pointer text-sm tracking-wider uppercase">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </SheetContent>
  );
}

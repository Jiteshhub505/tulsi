"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { CartItems } from "./components/CartItems";
export type ProductType = {
  cartItemId: string;
  discountPrice: number;
  image: string[];
  name: string;
  price: number;
  productId: string | number;
  quantity: number;
};
const page = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const response = await axios.get("/api/cart/fetchcart");

      if (response.data.success) {
        setProducts(response.data.items);
      } else {
        console.log("error fetching cart from DB", response.data.error);
        setProducts([]);
      }
    } catch (error) {
      console.error("error fetching cart", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Suspense fallback={
      <div className="p-10 space-y-4 max-w-5xl mx-auto animate-pulse">
        <div className="bg-gray-200 h-6 w-1/3 rounded"></div>
        <div className="bg-gray-200 h-64 rounded"></div>
      </div>
    }>
      <CartItems
        loading={loading}
        products={products}
        setProducts={setProducts}
      />
    </Suspense>
  );
};

export default page;

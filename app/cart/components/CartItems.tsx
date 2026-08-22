"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ProductType } from "../page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RemoveProduct from "./RemoveProductModal";
import { useSession } from "next-auth/react";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import EmptyCartPage from "./EmptyCart";
import { ArrowLeft, Sparkles, Truck, CheckCircle2, MapPin, Loader2, Coins, Gift, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PlaceOrderButton from "@/components/payment/PlaceOrderButton";
import LoginModal from "@/components/landing/LoginModal";
import toast from "react-hot-toast";

type PropType = {
  loading: boolean;
  products: ProductType[];
  setProducts: Dispatch<SetStateAction<ProductType[]>>;
};
export type Details = {
  cartItemId: string;
  productId: string | number;
};

export const CartItems = ({ loading, products, setProducts }: PropType) => {
  const [coupon, setCoupon] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [details, setDetails] = useState<Details>({
    cartItemId: "",
    productId: 0,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Checkout flow states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Tulsi Coins & 2factor.in Reward states
  const [coinModalOpen, setCoinModalOpen] = useState(false);
  const [userWallet, setUserWallet] = useState<{
    balance: number;
    isPhoneVerified: boolean;
    totalEarned: number;
  } | null>(null);
  const [useCoins, setUseCoins] = useState(false);

  // Auto-fetch address & Shiprocket serviceability states
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [addressAutoFilled, setAddressAutoFilled] = useState(false);
  const [serviceability, setServiceability] = useState<{
    loading: boolean;
    serviceable: boolean | null;
    estimatedDays?: number;
    courierName?: string;
    count?: number;
  }>({ loading: false, serviceable: null });

  // Form states
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [appliedCouponData, setAppliedCouponData] = useState<{
    code: string;
    discountAmount: number;
    discountType?: string;
    discountValue?: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleProceedToCheckout = () => {
    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("tulsi_user_phone") : null;
    const cleanPhone = savedPhone?.replace(/\D/g, "").slice(-10) || "";
    if (cleanPhone.length !== 10) {
      toast.error("Please verify your mobile number to checkout");
      setLoginModalOpen(true);
      return;
    }
    setIsCheckingOut(true);
  };

  const handleLoginSuccess = (wallet: any) => {
    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("tulsi_user_phone") : null;
    const cleanPhone = wallet?.phone || savedPhone?.replace(/\D/g, "").slice(-10) || "";
    if (cleanPhone.length === 10) {
      handlePhoneChange(cleanPhone);
    }
    if (wallet) {
      setUserWallet(wallet);
      if (wallet.balance > 0) {
        setUseCoins(true);
      }
    }
    setIsCheckingOut(true);
  };

  useEffect(() => {
    if (searchParams.get("checkout") === "true") {
      const savedPhone = typeof window !== "undefined" ? localStorage.getItem("tulsi_user_phone") : null;
      const cleanPhone = savedPhone?.replace(/\D/g, "").slice(-10) || "";
      if (cleanPhone.length !== 10) {
        setLoginModalOpen(true);
      } else {
        setIsCheckingOut(true);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Check saved user phone from localStorage
    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("tulsi_user_phone") : null;
    if (savedPhone && savedPhone.length === 10) {
      setShippingDetails((prev) => ({ ...prev, phone: prev.phone || savedPhone }));
      axios
        .get(`/api/rewards/wallet?phone=${savedPhone}`)
        .then((walletRes) => {
          if (walletRes.data?.success && walletRes.data.wallet) {
            setUserWallet(walletRes.data.wallet);
            if (walletRes.data.wallet.balance > 0) {
              setUseCoins(true);
            }
          }
        })
        .catch(() => {});
    }

    const handleWalletUpdate = (e: any) => {
      if (e?.detail) {
        setUserWallet(e.detail);
        if (e.detail.phone) {
          setShippingDetails((prev) => ({ ...prev, phone: prev.phone || e.detail.phone }));
        }
        if (e.detail.balance > 0) {
          setUseCoins(true);
        }
      }
    };
    window.addEventListener("wallet-updated", handleWalletUpdate);
    return () => window.removeEventListener("wallet-updated", handleWalletUpdate);
  }, []);

  const handleApplyCoupon = async () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (code === "") {
      setAppliedCoupon(null);
      setAppliedCouponData(null);
      return;
    }
    try {
      const activePhone = shippingDetails.phone || (typeof window !== "undefined" ? localStorage.getItem("tulsiveda_user_phone") : "") || "";
      const res = await axios.post("/api/coupons/validate", {
        code,
        subtotal,
        phone: activePhone,
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.code);
        setAppliedCouponData(res.data);
        toast.success(res.data.message || `Coupon ${res.data.code} applied!`);
      } else {
        setCouponError(res.data.message || "Invalid coupon code");
        setAppliedCoupon(null);
        setAppliedCouponData(null);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid coupon code";
      setCouponError(msg);
      setAppliedCoupon(null);
      setAppliedCouponData(null);
      toast.error(msg);
    }
  };

  const handlePhoneChange = async (phoneVal: string) => {
    setShippingDetails((prev) => ({ ...prev, phone: phoneVal }));
    const cleanPhone = phoneVal.replace(/\D/g, "").slice(-10);

    if (cleanPhone.length === 10) {
      // Auto fetch Tulsi Coin wallet
      axios
        .get(`/api/rewards/wallet?phone=${cleanPhone}`)
        .then((walletRes) => {
          if (walletRes.data?.success && walletRes.data.wallet) {
            setUserWallet(walletRes.data.wallet);
            if (walletRes.data.wallet.balance > 0) {
              setUseCoins(true);
            }
          }
        })
        .catch(() => {});

      setFetchingAddress(true);
      try {
        const res = await axios.post("/api/checkout/fetch-address-by-phone", {
          phone: cleanPhone,
        });

        if (res.data.success && res.data.found && res.data.address) {
          const addr = res.data.address;
          setShippingDetails((prev) => ({
            ...prev,
            fullName: prev.fullName || addr.fullName || "",
            email: prev.email || addr.email || "",
            phone: cleanPhone,
            street: addr.street || prev.street || "",
            city: addr.city || prev.city || "",
            state: addr.state || prev.state || "",
            pinCode: addr.pinCode || prev.pinCode || "",
          }));
          setAddressAutoFilled(true);
          const isFromSr = res.data.source === "shiprocket_database";
          toast.success(isFromSr ? "⚡ Address auto-filled from Shiprocket!" : "⚡ Saved address auto-filled!", {
            id: "addr-autofill",
            duration: 3500,
          });

          if (addr.pinCode && addr.pinCode.length === 6) {
            checkPincodeService(addr.pinCode);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetchingAddress(false);
      }
    } else {
      setAddressAutoFilled(false);
    }
  };

  const checkPincodeService = async (pin: string) => {
    if (!pin || pin.length !== 6) return;
    setServiceability({ loading: true, serviceable: null });
    try {
      const res = await axios.get(`/api/shiprocket/serviceability?pincode=${pin}`);
      if (res.data.success && res.data.serviceable) {
        setServiceability({
          loading: false,
          serviceable: true,
          estimatedDays: res.data.estimatedDeliveryDays,
          courierName: res.data.recommendedCourier,
          count: res.data.availableCouriersCount,
        });
      } else {
        setServiceability({ loading: false, serviceable: false });
      }
    } catch {
      setServiceability({ loading: false, serviceable: null });
    }
  };

  // 1️⃣ Calculate effective unit price & line total (10% OFF for 2+ quantity)
  const getItemUnitPrice = (p: ProductType) => {
    const base = p.discountPrice ?? p.price;
    return p.quantity >= 2 ? Math.round(base * 0.9) : base;
  };

  const getItemLineTotal = (p: ProductType) => {
    return getItemUnitPrice(p) * p.quantity;
  };

  // Price calculations
  const totalItems = products.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = products.reduce((sum, p) => sum + getItemLineTotal(p), 0);

  // Multi-buy savings total (10% off on items with quantity >= 2)
  const multiBuySavings = products.reduce((sum, p) => {
    if (p.quantity >= 2) {
      const base = p.discountPrice ?? p.price;
      return sum + (base * p.quantity - getItemLineTotal(p));
    }
    return sum;
  }, 0);

  // Total discount (catalog discount)
  const totalDiscount = products.reduce((sum, p) => {
    if (!p.discountPrice) return sum;
    return sum + (p.price - p.discountPrice) * p.quantity;
  }, 0);

  const total = subtotal;

  const couponDiscount = appliedCouponData
    ? appliedCouponData.discountAmount
    : appliedCoupon === "KRISH10"
    ? Math.round(subtotal * 0.1)
    : 0;
  const subtotalAfterCoupon = subtotal - couponDiscount;

  const maxCoinsApplicable = Math.min(
    userWallet?.balance || 0,
    Math.floor(subtotalAfterCoupon * 0.5)
  );
  const coinDiscount = useCoins ? maxCoinsApplicable : 0;
  const shippingFee = paymentMethod === "cod" ? 50 : 0;
  const finalTotal = Math.max(1, subtotalAfterCoupon - coinDiscount + shippingFee);
  const cashbackCoinsEarned = Math.round(finalTotal * 0.05);

  const handlePlaceOrder = async () => {
    const { fullName, email, phone, street, city, state, pinCode } = shippingDetails;
    if (!fullName || !email || !phone || !street || !city || !state || !pinCode) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setPlacingOrder(true);
    try {
      if (paymentMethod === "cod") {
        const response = await axios.post("/api/orders/place-cart", {
          shippingDetails,
          paymentMethod: "cod",
          couponCode: appliedCoupon,
          coinsToUse: coinDiscount,
        });

        if (response.data.success) {
          setOrderSuccess(response.data.order);
          setProducts([]);
          window.dispatchEvent(new Event("cart-updated"));
          if (userWallet && coinDiscount > 0) {
            setUserWallet((prev: any) =>
              prev ? { ...prev, balance: Math.max(0, prev.balance - coinDiscount) } : null
            );
          }
        } else {
          toast.error(response.data.message || "Failed to place order");
        }
      } else {
        // Razorpay flow
        let response;
        try {
          response = await axios.post("/api/orders/initiate-payment", {
            couponCode: appliedCoupon,
            coinsToUse: coinDiscount,
            phone: shippingDetails.phone,
          });
        } catch (err: any) {
          const errMsg = err.response?.data?.message || "Failed to initiate Razorpay payment. Please check API keys or use COD.";
          toast.error(errMsg);
          setPlacingOrder(false);
          return;
        }

        if (!response.data?.success) {
          toast.error(response.data?.message || "Failed to initiate payment");
          setPlacingOrder(false);
          return;
        }

        const { keyId, id, amount, currency } = response.data;

        if (typeof window === "undefined" || !(window as any).Razorpay) {
          toast.error("Razorpay SDK not loaded yet. Please refresh the page or select Cash on Delivery.");
          setPlacingOrder(false);
          return;
        }

        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: "TulsiVeda",
          description: "Complete checkout payment",
          order_id: id,
          handler: async function (paymentResponse: any) {
            setPlacingOrder(true);
            try {
              const verifyRes = await axios.post("/api/orders/verify-payment", {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                shippingDetails,
                paymentMethod: "razorpay",
                couponCode: appliedCoupon,
                coinsToUse: coinDiscount,
              });

              if (verifyRes.data.success) {
                setOrderSuccess(verifyRes.data.order);
                setProducts([]);
                window.dispatchEvent(new Event("cart-updated"));
                if (userWallet && coinDiscount > 0) {
                  setUserWallet((prev: any) =>
                    prev ? { ...prev, balance: Math.max(0, prev.balance - coinDiscount) } : null
                  );
                }
              } else {
                toast.error(verifyRes.data.message || "Payment verification failed");
              }
            } catch (err: any) {
              console.error(err);
              toast.error(err.response?.data?.message || "Payment verification failed");
            } finally {
              setPlacingOrder(false);
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#047857",
          },
          modal: {
            ondismiss: function () {
              setPlacingOrder(false);
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.on("payment.failed", function (resp: any) {
          console.error("Razorpay Payment Failed:", resp.error);
          toast.error(resp.error?.description || "Payment failed or was cancelled.");
          setPlacingOrder(false);
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      if (paymentMethod === "cod") {
        setPlacingOrder(false);
      }
    }
  };

  useEffect(() => {}, [products]);

  const updateQuantity = async (
    productId: string | number,
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
  const decreaseQuantity = (productId: string | number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.productId !== productId) return p;
        if (p.quantity >= 1) {
          const updated = p.quantity - 1;
          if (updated == 0) {
            setModal(true);
            setDetails({
              cartItemId: p.cartItemId,
              productId: p.productId,
            });
            return p;
          }
          debouncedServer(p.productId, updated, p.cartItemId);
          return { ...p, quantity: updated };
        }

        if (p.quantity == 0) setModal(true);
        return p;
      })
    );
  };

  const increaseQuantity = (productId: string | number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.productId !== productId) return p;
        debouncedServer(p.productId, p.quantity + 1, p.cartItemId);
        return { ...p, quantity: p.quantity + 1 };
      })
    );
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="inline-flex items-center justify-center size-20 rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Order Placed Successfully!</h2>
        <p className="text-stone-500 max-w-sm mx-auto text-sm">
          Thank you for shopping with TulsiVeda! Your order has been registered in our database.
        </p>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 text-left space-y-4 shadow-xs">
          <div className="flex justify-between text-xs text-stone-500">
            <span>ORDER ID</span>
            <span className="font-mono font-bold text-stone-850">{orderSuccess.order_id}</span>
          </div>
          <hr className="border-stone-100" />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">Shipping Details</h4>
            <p className="text-sm font-medium text-stone-850">{orderSuccess.shippingDetails?.fullName}</p>
            <p className="text-xs text-stone-500">{orderSuccess.shippingDetails?.street}</p>
            <p className="text-xs text-stone-500">
              {orderSuccess.shippingDetails?.city}, {orderSuccess.shippingDetails?.state} - {orderSuccess.shippingDetails?.pinCode}
            </p>
            <p className="text-xs text-stone-500">Phone: {orderSuccess.shippingDetails?.phone}</p>
          </div>
          <hr className="border-stone-100" />
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Payment Method</span>
            <span className="font-semibold text-stone-900 uppercase">
              {orderSuccess.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay Secure"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Total Amount</span>
            <span className="font-bold text-emerald-800">₹{orderSuccess.amount?.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setProducts([]);
            window.dispatchEvent(new Event("cart-updated"));
            router.push("/shop");
          }}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-4 rounded-xl transition-all shadow-md cursor-pointer"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return <EmptyCartPage />;
  }

  if (products.length === 0 && status != "loading")
    return (
      <div className="p-10 space-y-4">
        <div className="bg-gray-200 h-6 w-1/3 rounded animate-pulse"></div>
        <div className="bg-gray-200 h-64 rounded animate-pulse"></div>
        <div className="bg-gray-200 h-4 w-1/2 rounded animate-pulse"></div>
      </div>
    );

  if (isCheckingOut) {
    const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.push("/")}
            className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition cursor-pointer"
          >
            <ArrowLeft className="size-5 text-stone-700" />
          </button>
          <h2 className="text-2xl font-bold text-stone-900">Checkout</h2>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Shipping details & Payment options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Details */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  Shipping Details
                </h3>
                {addressAutoFilled && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 animate-in fade-in duration-300">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Auto-Filled via Shiprocket
                  </span>
                )}
              </div>

              {/* Phone number field with 1-Click auto-fill assistant */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/70 to-teal-50/40 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>Mobile Number</span>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Instant 1-Click Auto-Fill
                    </span>
                  </label>
                  {fetchingAddress && (
                    <span className="text-xs text-emerald-800 flex items-center gap-1 font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Looking up saved address...
                    </span>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={shippingDetails.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full border border-emerald-300/80 bg-white rounded-xl pl-13 pr-4 py-3 text-sm font-semibold tracking-wider text-stone-900 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-stone-500">
                  Enter your number to instantly pull your saved delivery address and details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={shippingDetails.fullName}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={shippingDetails.email}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-stone-700">Street / House / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter flat, house no., building, street and area"
                    value={shippingDetails.street}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, street: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter city"
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-700">State</label>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={shippingDetails.state}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-700">PIN Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      title="Please enter a valid 6-digit PIN code"
                      placeholder="6-digit PIN"
                      value={shippingDetails.pinCode}
                      onChange={(e) => {
                        const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setShippingDetails({ ...shippingDetails, pinCode: pin });
                        if (pin.length === 6) {
                          checkPincodeService(pin);
                        }
                      }}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm font-semibold tracking-wider focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Shiprocket Delivery ETA Live Badge */}
              {serviceability.loading && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700 shrink-0" />
                  Calculating fastest courier delivery route...
                </div>
              )}

              {serviceability.serviceable && (
                <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between gap-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900">
                        ⚡ Express Delivery in {serviceability.estimatedDays} Days
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                        Shipped via {serviceability.courierName} • Pincode {shippingDetails.pinCode} Serviceable
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                    Shiprocket Fast
                  </span>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">Payment Method</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Razorpay card */}
                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col justify-between transition ${
                    paymentMethod === "razorpay"
                      ? "border-emerald-600 bg-emerald-50/10"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-emerald-700 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-stone-900">Razorpay Secure</span>
                  </div>
                  <span className="text-xs text-stone-500 mt-2">UPI, Cards, Wallets, NetBanking</span>
                </div>

                {/* COD card */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col justify-between transition ${
                    paymentMethod === "cod"
                      ? "border-emerald-600 bg-emerald-50/10"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-emerald-700 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-stone-900">Cash on Delivery</span>
                  </div>
                  <span className="text-xs text-stone-500 mt-2">Pay when you receive the order</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Promo code */}
          <div className="space-y-6">
            {/* Tulsi Coins Redemption (Only shown when customer has active coins) */}
            {userWallet?.isPhoneVerified && userWallet.balance > 0 && (
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200/80 rounded-2xl p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🪙</span>
                    <h4 className="text-sm font-bold text-stone-900">Tulsi Coins</h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {userWallet.balance} Coins Available
                  </span>
                </div>

                <label className="flex items-center gap-3 p-3 bg-white border border-emerald-200 rounded-xl cursor-pointer hover:border-emerald-400 transition">
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={(e) => setUseCoins(e.target.checked)}
                    className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-stone-900">
                      Redeem {maxCoinsApplicable} Coins (-₹{maxCoinsApplicable})
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Applied instantly to this order
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">Order Summary</h3>
              
              <ul className="text-stone-500 text-sm font-medium space-y-3">
                <li className="flex justify-between">
                  <span>Total Items</span>
                  <span className="text-stone-950 font-bold">{totalItems}</span>
                </li>
                <li className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-950 font-bold">₹{subtotal.toLocaleString()}</span>
                </li>
                {appliedCoupon && couponDiscount > 0 && (
                  <li className="flex justify-between text-emerald-700 font-semibold">
                    <span>
                      Coupon ({appliedCoupon}
                      {appliedCouponData?.discountType === "percentage" ? ` - ${appliedCouponData.discountValue}% OFF` : ""})
                    </span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </li>
                )}
                {coinDiscount > 0 && (
                  <li className="flex justify-between text-amber-800 font-semibold">
                    <span className="flex items-center gap-1">🪙 Tulsi Coins Discount</span>
                    <span>-₹{coinDiscount.toLocaleString()}</span>
                  </li>
                )}
                <li className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-750 font-bold">{paymentMethod === "cod" ? "+₹50" : "FREE"}</span>
                </li>
                <hr className="border-stone-100 my-1" />
                <li className="flex justify-between text-base text-stone-950 font-extrabold">
                  <span>Amount to Pay</span>
                  <span className="text-emerald-800">₹{finalTotal.toLocaleString()}</span>
                </li>
              </ul>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Earn {cashbackCoinsEarned} Tulsi Coins (5% Cashback) on this order!
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl transition shadow-md disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {placingOrder ? "Placing Order..." : "PLACE ORDER"}
              </button>
            </div>

            {/* Promo Code Coupon */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">Apply Coupon</h4>
              <div className="flex border border-stone-300 overflow-hidden rounded-xl bg-white focus-within:border-emerald-600 transition">
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g. KRISH10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full outline-hidden bg-transparent text-stone-600 text-sm px-4 py-3"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-xs font-semibold">{couponError}</p>
              )}
              {appliedCoupon && (
                <p className="text-emerald-700 text-xs font-semibold">Coupon applied: {appliedCoupon}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden lg:max-w-5xl max-lg:max-w-2xl mx-auto  ">
      <div className="grid w-screen lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2    p-6 rounded-md">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="cursor-pointer " />
            </Button>
            {/* <p className=" font-semibold text-slate-900 ">Back to Home</p> */}
            <h3 className="text-lg font-semibold text-slate-900 ">Your Cart</h3>
          </div>
          <hr className="border-gray-300 mt-4 mb-8" />

          {products.map((p: ProductType, i: number) => {
            const price = p.discountPrice ?? p.price;

            return (
              <div key={i} className="bg-white sm:space-y-6 space-y-8">
                <div className="grid sm:grid-cols-3 items-center gap-4">
                  <div className="sm:col-span-2 flex sm:items-center max-sm:flex-col gap-6">
                    <Link href={`/shop/${p.productId}`} className="w-40 h-40 shrink-0 bg-white p-2 rounded-md block hover:opacity-90 transition-opacity cursor-pointer">
                      <img
                        src={p.image[0]}
                        alt={p.name}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    <div>
                      <Link href={`/shop/${p.productId}`} className="hover:text-emerald-700 transition-colors">
                        <h4 className="text-[25px] font-semibold text-slate-900 hover:text-emerald-700 transition-colors">
                          {p.name}
                        </h4>
                      </Link>
                      {p.quantity >= 2 && (
                        <span className="inline-block mt-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          🔥 10% Multi-Buy Discount Applied!
                        </span>
                      )}

                      <h6
                        onClick={() => {
                          setModal(true);

                          setDetails({
                            cartItemId: p.cartItemId,
                            productId: p.productId,
                          });
                        }}
                        className="text-xs font-medium text-red-500 cursor-pointer mt-1"
                      >
                        Remove
                      </h6>

                      <div className="flex gap-4 mt-4">
                        <div>
                          <div className="flex items-center px-2.5 py-1.5 border border-gray-300 text-slate-900 text-xs rounded-md">
                            {/* minus */}
                            <span
                              onClick={() => decreaseQuantity(p.productId)}
                              className="cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-2.5 fill-current"
                                viewBox="0 0 124 124"
                              >
                                <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" />
                              </svg>
                            </span>

                            <span className="mx-3">{p.quantity}</span>

                            {/* plus */}
                            <span
                              onClick={() => increaseQuantity(p.productId)}
                              className="cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-2.5 fill-current"
                                viewBox="0 0 42 42"
                              >
                                <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="sm:ml-auto text-right">
                    <h4 className="text-[16px] font-bold text-slate-900">
                      ₹{getItemLineTotal(p).toLocaleString()}
                    </h4>
                    {p.quantity >= 2 && (
                      <span className="text-xs text-stone-400 line-through block">
                        ₹{((p.discountPrice ?? p.price) * p.quantity).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <br />
              </div>
            );
          })}

          {/* ORDER DETAILS */}
          <div className="bg-white rounded-md p-6 md:sticky top-0 h-max">
            <h3 className="text-lg font-semibold text-slate-900">
              Order details
            </h3>
            <hr className="border-gray-300 mt-4 mb-8" />

            <ul className="text-slate-500 font-medium mt-8 space-y-4">
              {multiBuySavings > 0 && (
                <li className="flex flex-wrap gap-4 text-sm text-emerald-700 font-bold">
                  Multi-Buy Savings (10% OFF for 2+ items)
                  <span className="ml-auto text-emerald-700 font-bold">
                    -₹{multiBuySavings.toLocaleString()}
                  </span>
                </li>
              )}
              <li className="flex flex-wrap gap-4 text-sm">
                Discount{" "}
                <span className="ml-auto text-slate-900 font-semibold">
                  -₹{totalDiscount}
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Shipping{" "}
                <span className="ml-auto text-green-900 font-semibold">
                  Calculated at checkout
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm text-slate-900">
                Total <span className="ml-auto font-semibold">₹{total.toLocaleString()}</span>
              </li>
            </ul>

            <div className="mt-8 space-y-3">
              <button 
                onClick={handleProceedToCheckout}
                className="w-full bg-emerald-750 hover:bg-emerald-800 text-white font-semibold py-4 rounded-xl transition-all shadow-md shadow-emerald-700/10 cursor-pointer text-sm tracking-wider uppercase"
              >
                PROCEED TO CHECKOUT
              </button>
              <Link href={"/"}>
                <Button
                  type="button"
                  className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-transparent text-slate-900 hover:bg-white border border-gray-300 rounded-md cursor-pointer"
                >
                  Continue Shopping{" "}
                </Button>
              </Link>
            </div>
            <div className="mt-6">
              <p className="text-slate-900 text-sm font-medium mb-2">
                Do you have a promo code?
              </p>
              <div className="flex border border-emerald-600 overflow-hidden rounded-md">
                <input
                  type="text"
                  placeholder="Promo code (e.g. KRISH10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full outline-hidden bg-white text-slate-600 text-sm px-4 py-2.5"
                />
                <Button
                  type="button"
                  className="flex items-center justify-center font-medium tracking-wide bg-emerald-700 hover:bg-emerald-800 px-4 text-sm text-white cursor-pointer"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </Button>
              </div>
              {couponError && (
                <p className="text-red-500 font-bold mt-1 text-xs">{couponError}</p>
              )}
            </div>
          </div>
        </div>
        {modal && (
          <RemoveProduct
            setProducts={setProducts}
            details={details}
            setDetails={setDetails}
            modal={modal}
            setModal={setModal}
          />
        )}
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  );
};

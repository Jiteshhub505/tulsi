import { Schema, models, model } from "mongoose";
import { uuid, sharedOptions } from "./_shared";

export const ORDER_STATUSES = ["created", "paid", "failed", "cancelled"] as const;

export interface IShiprocket {
  orderId?: number | null;
  shipmentId?: number | null;
  awbCode?: string | null;
  courierName?: string | null;
  courierCompanyId?: number | null;
  status?: string | null;
  statusCode?: number | null;
  labelUrl?: string | null;
  manifestUrl?: string | null;
  invoiceUrl?: string | null;
  pickupTokenNumber?: string | null;
  pickupScheduledDate?: string | null;
  lastTrackingUpdate?: Date | null;
  trackingHistory?: Array<{
    date?: string;
    status?: string;
    activity?: string;
    location?: string;
  }>;
}

export interface IOrder {
  _id: string;
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  order_status: (typeof ORDER_STATUSES)[number];
  shippingDetails?: {
    fullName?: string;
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    pinCode?: string;
  };
  paymentMethod?: string;
  couponCode?: string;
  coinsUsed?: number;
  coinDiscount?: number;
  shiprocket?: IShiprocket;
  createdAt?: Date;
  updatedAt?: Date | null;
}

const orderSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    order_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    order_status: { type: String, enum: ORDER_STATUSES, required: true },
    shippingDetails: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pinCode: { type: String, default: "" },
    },
    paymentMethod: { type: String, default: "razorpay" },
    couponCode: { type: String, default: "" },
    coinsUsed: { type: Number, default: 0 },
    coinDiscount: { type: Number, default: 0 },
    shiprocket: {
      orderId: { type: Number, default: null },
      shipmentId: { type: Number, default: null },
      awbCode: { type: String, default: null },
      courierName: { type: String, default: null },
      courierCompanyId: { type: Number, default: null },
      status: { type: String, default: null },
      statusCode: { type: Number, default: null },
      labelUrl: { type: String, default: null },
      manifestUrl: { type: String, default: null },
      invoiceUrl: { type: String, default: null },
      pickupTokenNumber: { type: String, default: null },
      pickupScheduledDate: { type: String, default: null },
      lastTrackingUpdate: { type: Date, default: null },
      trackingHistory: {
        type: [
          {
            date: String,
            status: String,
            activity: String,
            location: String,
          },
        ],
        default: [],
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
  },
  { ...sharedOptions, _id: false },
);

// Force clear cached model in development to apply schema updates
if (models.Order) {
  delete (models as any).Order;
}

export default (models.Order || model("Order", orderSchema, "orders")) as any;

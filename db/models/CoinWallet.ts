import mongoose, { Schema, models, model } from "mongoose";

export interface ICoinTransaction {
  type: "welcome" | "order_earn" | "order_redeem" | "bonus";
  amount: number;
  orderId?: string;
  description: string;
  date: Date;
}

export interface ICoinWallet {
  phone: string;
  userId?: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  isPhoneVerified: boolean;
  hasSpunWheel: boolean;
  spinWonAmount: number;
  history: ICoinTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const coinTransactionSchema = new Schema<ICoinTransaction>(
  {
    type: {
      type: String,
      enum: ["welcome", "order_earn", "order_redeem", "bonus"],
      required: true,
    },
    amount: { type: Number, required: true },
    orderId: { type: String, default: null },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const coinWalletSchema = new Schema<ICoinWallet>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    userId: { type: String, default: null, index: true },
    balance: { type: Number, default: 0, min: 0 },
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    isPhoneVerified: { type: Boolean, default: false },
    hasSpunWheel: { type: Boolean, default: false },
    spinWonAmount: { type: Number, default: 0 },
    history: { type: [coinTransactionSchema], default: [] },
  },
  {
    timestamps: true,
    collection: "coin_wallets",
  }
);

if (models.CoinWallet) {
  delete (models as any).CoinWallet;
}

export default (models.CoinWallet ||
  model<ICoinWallet>("CoinWallet", coinWalletSchema, "coin_wallets")) as any;

import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Coupon, Order } from "@/db/models";

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json().catch(() => ({}));
    const { code, subtotal = 0, phone = "" } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: "Please enter a coupon code" }, { status: 400 });
    }

    const cleanCode = code.toString().trim().toUpperCase();
    const cleanPhone = phone ? phone.toString().replace(/\D/g, "").slice(-10) : "";

    // Check if phone already redeemed this coupon in orders
    if (cleanPhone) {
      const existingOrder = await Order.findOne({
        couponCode: cleanCode,
        "shippingDetails.phone": new RegExp(cleanPhone + "$"),
        order_status: { $in: ["created", "paid"] },
      });
      if (existingOrder) {
        return NextResponse.json({
          success: false,
          message: `Coupon '${cleanCode}' has already been used on mobile number +91 ${cleanPhone}. Each coupon is valid only once per phone number.`,
        }, { status: 400 });
      }
    }

    // Built-in fallback support for KRISH10 if not in database
    if (cleanCode === "KRISH10") {
      const discount = Math.round(Number(subtotal) * 0.1);
      return NextResponse.json({
        success: true,
        code: "KRISH10",
        discountType: "percentage",
        discountValue: 10,
        discountAmount: discount,
        message: "Coupon 'KRISH10' applied (10% OFF)!",
      });
    }

    const coupon = await Coupon.findOne({ code: cleanCode });
    if (!coupon) {
      return NextResponse.json({ success: false, message: `Coupon code '${cleanCode}' is invalid` }, { status: 400 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, message: `Coupon '${cleanCode}' is currently disabled` }, { status: 400 });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ success: false, message: `Coupon '${cleanCode}' has expired` }, { status: 400 });
    }

    if (cleanPhone && coupon.usedPhones && coupon.usedPhones.includes(cleanPhone)) {
      return NextResponse.json({
        success: false,
        message: `Coupon '${cleanCode}' has already been used on mobile number +91 ${cleanPhone}. Each coupon is valid only once per phone number.`,
      }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, message: `Coupon '${cleanCode}' usage limit has been reached` }, { status: 400 });
    }

    if (coupon.minOrderAmount && Number(subtotal) < coupon.minOrderAmount) {
      return NextResponse.json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for coupon '${cleanCode}'`,
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      let calculated = (Number(subtotal) * coupon.discountValue) / 100;
      if (coupon.maxDiscount && calculated > coupon.maxDiscount) {
        calculated = coupon.maxDiscount;
      }
      discountAmount = Math.round(calculated);
    } else {
      discountAmount = Math.min(Number(subtotal), coupon.discountValue);
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      message: `Coupon '${coupon.code}' applied successfully (-₹${discountAmount})!`,
    });
  } catch (error: any) {
    console.error("VALIDATE_COUPON_ERROR", error);
    return NextResponse.json({ success: false, message: "Failed to validate coupon" }, { status: 500 });
  }
}

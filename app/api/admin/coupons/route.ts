import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Coupon } from "@/db/models";

// GET: Fetch all coupons
export async function GET() {
  await connectDB();
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    console.error("GET_COUPONS_ERROR", error);
    return NextResponse.json({ success: false, message: "Failed to fetch coupons" }, { status: 500 });
  }
}

// POST: Create a new coupon code
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    let {
      code,
      discountType = "percentage",
      discountValue,
      minOrderAmount = 0,
      maxDiscount = null,
      expiryDate = null,
      usageLimit = null,
    } = body;

    if (!code || !discountValue || discountValue <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid Coupon Code and Discount Value are required" },
        { status: 400 }
      );
    }

    const cleanCode = code.toString().trim().toUpperCase().replace(/\s+/g, "");

    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Coupon '${cleanCode}' already exists` },
        { status: 400 }
      );
    }

    const newCoupon = await Coupon.create({
      code: cleanCode,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      usedCount: 0,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: `Coupon '${cleanCode}' created successfully`,
      coupon: newCoupon,
    });
  } catch (error: any) {
    console.error("CREATE_COUPON_ERROR", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a coupon by ID or code
export async function DELETE(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!id && !code) {
      return NextResponse.json(
        { success: false, message: "Coupon ID or Code is required" },
        { status: 400 }
      );
    }

    const query: any = {};
    if (id) query._id = id;
    if (code) query.code = code;

    const deleted = await Coupon.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Coupon '${deleted.code}' deleted successfully`,
    });
  } catch (error: any) {
    console.error("DELETE_COUPON_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}

// PATCH: Toggle active status
export async function PATCH(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "ID and isActive status are required" },
        { status: 400 }
      );
    }

    const updated = await Coupon.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Coupon '${updated.code}' is now ${isActive ? "Active" : "Inactive"}`,
      coupon: updated,
    });
  } catch (error: any) {
    console.error("UPDATE_COUPON_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Order } from "@/db/models";
import { generateInvoice } from "@/lib/shiprocket";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { orderId, shiprocketOrderId } = await req.json();

    if (!orderId && !shiprocketOrderId) {
      return NextResponse.json(
        { success: false, message: "orderId or shiprocketOrderId is required" },
        { status: 400 }
      );
    }

    let order = null;
    let targetOrderId = shiprocketOrderId;

    if (orderId) {
      order = await Order.findOne({ order_id: orderId });
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }
      targetOrderId = order.shiprocket?.orderId || shiprocketOrderId;
    }

    if (!targetOrderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Shiprocket Order ID not found. Ensure order is synced to Shiprocket first.",
        },
        { status: 400 }
      );
    }

    const res = await generateInvoice([targetOrderId]);
    const invoiceUrl = res?.invoice_url || res?.response?.invoice_url || res?.data?.invoice_url;

    if (order && invoiceUrl) {
      order.shiprocket = {
        ...order.shiprocket,
        invoiceUrl,
      };
      await order.save();
    }

    return NextResponse.json({
      success: true,
      invoiceUrl,
      data: res,
    });
  } catch (error: any) {
    console.error("SHIPROCKET_GENERATE_INVOICE_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.response?.data?.message || error.message || "Failed to generate invoice",
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}

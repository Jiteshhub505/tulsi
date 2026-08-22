import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Order, OrderItem, Product } from "@/db/models";
import { syncOrderToShiprocket } from "@/lib/shiprocket";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId is required" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const orderItems = await OrderItem.find({ order_id: orderId });
    const productIds = orderItems.map((item) => item.product_id);
    const products = await Product.find({ _id: { $in: productIds } });

    const shiprocketRes = await syncOrderToShiprocket(order, orderItems, products);

    // Save Shiprocket order and shipment info to order
    if (shiprocketRes && (shiprocketRes.order_id || shiprocketRes.shipment_id)) {
      order.shiprocket = {
        ...order.shiprocket,
        orderId: shiprocketRes.order_id,
        shipmentId: shiprocketRes.shipment_id,
        status: shiprocketRes.status || "NEW",
        statusCode: shiprocketRes.status_code || 1,
        awbCode: shiprocketRes.awb_code || order.shiprocket?.awbCode || null,
        courierName: shiprocketRes.courier_name || order.shiprocket?.courierName || null,
        lastTrackingUpdate: new Date(),
      };

      await order.save();
    }

    return NextResponse.json({
      success: true,
      message: "Shiprocket order created successfully",
      shiprocket: shiprocketRes,
      order,
    });
  } catch (error: any) {
    console.error("SHIPROCKET_CREATE_ORDER_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.response?.data?.message || error.message || "Failed to create Shiprocket order",
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}

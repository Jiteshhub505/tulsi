import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Order } from "@/db/models";
import { trackShipment } from "@/lib/shiprocket";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const shipmentId = searchParams.get("shipmentId");
  const awbCode = searchParams.get("awbCode");

  try {
    let targetAwb = awbCode;
    let targetShipmentId = shipmentId;
    let order = null;

    if (orderId) {
      order = await Order.findOne({ order_id: orderId });
      if (order && order.shiprocket) {
        targetAwb = order.shiprocket.awbCode || targetAwb;
        targetShipmentId = order.shiprocket.shipmentId ? order.shiprocket.shipmentId.toString() : targetShipmentId;
      }
    }

    if (!targetAwb && !targetShipmentId) {
      return NextResponse.json(
        {
          success: false,
          message: "No tracking details (AWB or Shipment ID) available for this order yet.",
        },
        { status: 400 }
      );
    }

    const trackingRes = await trackShipment({
      awbCode: targetAwb || undefined,
      shipmentId: targetShipmentId || undefined,
    });

    const trackData = trackingRes?.tracking_data || trackingRes;
    const shipmentTrack = trackData?.shipment_track_activities || trackData?.shipment_track || [];
    const currentStatus =
      trackData?.shipment_status_text ||
      trackData?.current_status ||
      (Array.isArray(shipmentTrack) && shipmentTrack[0]?.activity) ||
      "In Transit";

    const formattedHistory = Array.isArray(shipmentTrack)
      ? shipmentTrack.map((act: any) => ({
          date: act.date || act["sr-status-label"] || "",
          status: act.status || act.current_status || "",
          activity: act.activity || act.status || "",
          location: act.location || "",
        }))
      : [];

    if (order) {
      order.shiprocket = {
        ...order.shiprocket,
        status: currentStatus,
        trackingHistory: formattedHistory.length > 0 ? formattedHistory : order.shiprocket?.trackingHistory,
        lastTrackingUpdate: new Date(),
      };
      await order.save();
    }

    return NextResponse.json({
      success: true,
      currentStatus,
      courierName: trackData?.courier_name || order?.shiprocket?.courierName,
      awbCode: targetAwb || order?.shiprocket?.awbCode,
      trackingUrl: trackData?.track_url || `https://shiprocket.co//tracking/${targetAwb}`,
      etd: trackData?.expected_date || trackData?.etd,
      trackingHistory: formattedHistory,
      raw: trackingRes,
    });
  } catch (error: any) {
    console.error("SHIPROCKET_TRACK_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.response?.data?.message || error.message || "Failed to fetch tracking data",
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}

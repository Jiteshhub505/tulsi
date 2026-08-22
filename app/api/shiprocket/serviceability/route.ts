import { NextResponse } from "next/server";
import { checkPincodeServiceability } from "@/lib/shiprocket";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const deliveryPincode = searchParams.get("pincode") || searchParams.get("delivery_postcode");
  const weight = Number(searchParams.get("weight")) || 0.5;
  const isCod = searchParams.get("cod") === "1" ? 1 : 0;
  const pickupPincode = searchParams.get("pickup_postcode") || "110001";

  if (!deliveryPincode || deliveryPincode.length < 6) {
    return NextResponse.json(
      { success: false, message: "Valid 6-digit delivery pincode is required" },
      { status: 400 }
    );
  }

  try {
    const res = await checkPincodeServiceability({
      pickupPostcode: pickupPincode,
      deliveryPostcode: deliveryPincode,
      weight,
      cod: isCod,
    });

    const data = res?.data || res;
    const availableCouriers = data?.available_courier_companies || [];
    const isServiceable = availableCouriers.length > 0;

    let minEstimatedDays = 5;
    let minRate = 0;
    let recommendedCourier = "";

    if (isServiceable) {
      minEstimatedDays = Math.min(
        ...availableCouriers.map((c: any) => Number(c.estimated_delivery_days) || 4)
      );
      minRate = Math.min(
        ...availableCouriers.map((c: any) => Number(c.rate) || 0)
      );
      recommendedCourier = availableCouriers[0]?.courier_name || "Express Delivery";
    }

    return NextResponse.json({
      success: true,
      serviceable: isServiceable,
      deliveryPincode,
      estimatedDeliveryDays: minEstimatedDays,
      recommendedCourier,
      availableCouriersCount: availableCouriers.length,
      availableCouriers: availableCouriers.map((c: any) => ({
        id: c.courier_company_id,
        name: c.courier_name,
        rate: c.rate,
        estimatedDays: c.estimated_delivery_days,
        etd: c.etd,
        cod: c.cod === 1,
      })),
    });
  } catch (error: any) {
    console.error("SERVICEABILITY_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        serviceable: false,
        message: error?.response?.data?.message || error.message || "Failed to check pincode serviceability",
      },
      { status: 500 }
    );
  }
}

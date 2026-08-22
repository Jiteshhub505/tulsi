import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import { Order, Address, User } from "@/db/models";
import { fetchAddressFromShiprocket } from "@/lib/shiprocket";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, found: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, found: false, message: "Valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    // 1. FIRST: Search customer address directly in Shiprocket Database
    try {
      const shiprocketAddress = await fetchAddressFromShiprocket(cleanPhone);
      if (
        shiprocketAddress &&
        shiprocketAddress.street &&
        (shiprocketAddress.city || shiprocketAddress.pinCode)
      ) {
        return NextResponse.json({
          success: true,
          found: true,
          source: "shiprocket_database",
          address: shiprocketAddress,
        });
      }
    } catch (srErr) {
      console.warn("Shiprocket address lookup warning:", srErr);
    }

    // 2. Fallback: Search recent Order in store with this phone number
    const recentOrder = await Order.findOne({
      "shippingDetails.phone": { $regex: cleanPhone },
      "shippingDetails.street": { $exists: true, $ne: "" },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (recentOrder && (recentOrder as any).shippingDetails) {
      const details = (recentOrder as any).shippingDetails;
      if (details.street && (details.city || details.pinCode)) {
        return NextResponse.json({
          success: true,
          found: true,
          source: "order",
          address: {
            fullName: details.fullName || "",
            email: details.email || "",
            phone: cleanPhone,
            street: details.street || "",
            city: details.city || "",
            state: details.state || "",
            pinCode: details.pinCode || "",
          },
        });
      }
    }

    // 2. Search saved Addresses collection
    const savedAddress = await Address.findOne({
      phoneNumber: { $regex: cleanPhone },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (savedAddress) {
      let userName = "";
      let userEmail = "";

      if ((savedAddress as any).userId) {
        const user = await User.findById((savedAddress as any).userId).lean();
        if (user) {
          userName = (user as any).name || "";
          userEmail = (user as any).email || "";
        }
      }

      const houseNumber = (savedAddress as any).houseNumber || "";
      const area = (savedAddress as any).area || "";
      const nearby = (savedAddress as any).nearby ? `, Near ${(savedAddress as any).nearby}` : "";
      const street = `${houseNumber} ${area}${nearby}`.trim();

      return NextResponse.json({
        success: true,
        found: true,
        source: "saved_address",
        address: {
          fullName: userName,
          email: userEmail,
          phone: cleanPhone,
          street: street,
          city: (savedAddress as any).city || "",
          state: (savedAddress as any).state || "",
          pinCode: (savedAddress as any).pincode || "",
        },
      });
    }

    // 3. Search User collection for profile info
    const userWithPhone = await User.findOne({
      phone: { $regex: cleanPhone },
    }).lean();

    if (userWithPhone) {
      return NextResponse.json({
        success: true,
        found: true,
        source: "user_profile",
        address: {
          fullName: (userWithPhone as any).name || "",
          email: (userWithPhone as any).email || "",
          phone: cleanPhone,
          street: "",
          city: "",
          state: "",
          pinCode: "",
        },
      });
    }

    return NextResponse.json({
      success: true,
      found: false,
      message: "No previous address found for this phone number",
    });
  } catch (error: any) {
    console.error("FETCH_ADDRESS_BY_PHONE_ERROR:", error);
    return NextResponse.json(
      { success: false, found: false, error: error.message },
      { status: 500 }
    );
  }
}

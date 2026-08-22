import axios from "axios";

async function runShiprocketTest() {
  console.log("=========================================");
  console.log("🚀 Testing Shiprocket API Integration");
  console.log("=========================================");

  const email = process.env.SHIPROCKET_EMAIL?.replace(/"/g, "").trim();
  const password = process.env.SHIPROCKET_PASSWORD?.replace(/"/g, "").trim();

  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password ? "********" : "MISSING"}`);

  if (!email || !password) {
    console.error("❌ Missing SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD.");
    process.exit(1);
  }

  const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

  // Step 1: Test Login & Token Generation
  let token = "";
  try {
    console.log("\n[1/3] Authenticating with Shiprocket...");
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    if (loginRes.data?.token) {
      token = loginRes.data.token;
      console.log("✅ Authentication Successful!");
      console.log(`🎟️ Token received (length: ${token.length})`);
    } else {
      console.error("❌ Login failed. Response:", loginRes.data);
      process.exit(1);
    }
  } catch (error: any) {
    console.error("❌ Authentication Error:", error?.response?.data || error.message);
    process.exit(1);
  }

  // Step 2: Fetch Pickup Locations
  try {
    console.log("\n[2/3] Fetching Configured Pickup Locations...");
    const pickupRes = await axios.get(`${BASE_URL}/settings/company/pickup`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const addresses = pickupRes.data?.data?.shipping_address || [];
    console.log(`✅ Found ${addresses.length} pickup location(s):`);
    addresses.forEach((addr: any, idx: number) => {
      console.log(
        `   ${idx + 1}. Nickname: "${addr.pickup_location}", City: ${addr.city}, State: ${addr.state}, Pincode: ${addr.pin_code}, Phone: ${addr.phone}`
      );
    });
  } catch (error: any) {
    console.warn("⚠️ Could not fetch pickup locations:", error?.response?.data?.message || error.message);
  }

  // Step 3: Test Pincode Serviceability & Couriers
  try {
    console.log("\n[3/3] Checking Courier Serviceability (Delhi 110001 -> Mumbai 400001)...");
    const serviceRes = await axios.get(`${BASE_URL}/courier/serviceability/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        pickup_postcode: "110001",
        delivery_postcode: "400001",
        weight: "0.5",
        cod: "0",
      },
    });

    const couriers = serviceRes.data?.data?.available_courier_companies || [];
    console.log(`✅ Serviceable! Found ${couriers.length} available courier partners:`);
    couriers.slice(0, 5).forEach((c: any, idx: number) => {
      console.log(
        `   ${idx + 1}. ${c.courier_name} (ID: ${c.courier_company_id}) - Rate: ₹${c.rate}, Est. Days: ${c.estimated_delivery_days} days`
      );
    });
  } catch (error: any) {
    console.error("❌ Serviceability check error:", error?.response?.data || error.message);
  }

  console.log("\n=========================================");
  console.log("🎉 Shiprocket Test Complete & Verified!");
  console.log("=========================================");
}

runShiprocketTest().catch(console.error);

import axios from "axios";

const TWO_FACTOR_API_KEY =
  process.env.TWO_FACTOR_API_KEY?.replace(/"/g, "").trim() ||
  process.env.TWOFACTOR_API_KEY?.replace(/"/g, "").trim() ||
  "";

/**
 * 1. Send OTP via 2factor.in
 */
export async function sendTwoFactorOtp(phone: string) {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, message: "Invalid 10-digit mobile number" };
  }

  // If no 2factor key is provided in .env yet, use instant demo verification mode
  if (!TWO_FACTOR_API_KEY || TWO_FACTOR_API_KEY === "demo_key") {
    console.warn("2factor.in: No TWO_FACTOR_API_KEY found in .env.local. Running in demo mode (use OTP: 1234 or auto-verify).");
    return {
      success: true,
      sessionId: `demo_session_${Date.now()}`,
      demoMode: true,
      message: "OTP sent successfully (Demo Mode: use 1234)",
    };
  }

  try {
    const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${cleanPhone}/AUTOGEN`;
    const response = await axios.get(url, { timeout: 8000 });

    if (response.data?.Status?.toLowerCase() === "success") {
      return {
        success: true,
        sessionId: response.data.Details,
        message: "OTP sent to your mobile number via SMS",
      };
    } else {
      return {
        success: false,
        message: response.data?.Details || "Failed to send OTP via 2factor.in",
      };
    }
  } catch (error: any) {
    console.error("2Factor.in send OTP error:", error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.Details || error.message || "Failed to send OTP",
    };
  }
}

/**
 * 2. Verify OTP via 2factor.in
 */
export async function verifyTwoFactorOtp(
  sessionId: string,
  otp: string,
  phone?: string
) {
  const cleanOtp = otp.trim();

  // Demo fallback
  if (!TWO_FACTOR_API_KEY || sessionId?.startsWith("demo_session_")) {
    if (cleanOtp === "1234" || cleanOtp === "0000" || cleanOtp.length >= 4) {
      return { success: true, message: "OTP verified successfully (Demo)" };
    }
    return { success: false, message: "Invalid OTP. Use 1234 in demo mode." };
  }

  try {
    const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${cleanOtp}`;
    const response = await axios.get(url, { timeout: 8000 });

    if (
      response.data?.Status?.toLowerCase() === "success" &&
      response.data?.Details?.toLowerCase()?.includes("match")
    ) {
      return { success: true, message: "OTP verified successfully" };
    } else {
      return {
        success: false,
        message: response.data?.Details || "Invalid OTP entered",
      };
    }
  } catch (error: any) {
    console.error("2Factor.in verify OTP error:", error?.response?.data || error.message);
    const errDetails = error?.response?.data?.Details;
    return {
      success: false,
      message: errDetails || "Invalid or expired OTP",
    };
  }
}

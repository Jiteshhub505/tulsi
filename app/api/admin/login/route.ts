export const POST = async (req: Request) => {
  try {
    const body = await req.json().catch(() => ({}));
    const { adminId = "", password = "" } = body;

    const expectedId = process.env.ADMIN_ID;
    const expectedPass = process.env.ADMIN_PASSWORD;

    if (!expectedId || !expectedPass) {
      return Response.json(
        { success: false, message: "Server configuration error: credentials not set" },
        { status: 500 }
      );
    }

    if (adminId.trim() === expectedId && password === expectedPass) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, message: "Invalid ID or Password" }, { status: 401 });
    }
  } catch (error) {
    console.error("ADMIN_LOGIN_ERROR", error);
    return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
};

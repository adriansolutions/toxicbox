import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET(req) {
  try {
    await connectDB();

    // SAFE WAY (Next.js App Router compatible)
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return Response.json({
        success: false,
        message: "Missing userId",
      });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return Response.json({
        success: false,
        message: "Profile not found",
      });
    }

    return Response.json({
      success: true,
      profile: user,
    });

  } catch (err) {
    console.log("GET PROFILE ERROR:", err);

    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}

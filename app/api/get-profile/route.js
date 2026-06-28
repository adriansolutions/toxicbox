import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

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
      user,
    });

  } catch (err) {
    console.log(err);
    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}

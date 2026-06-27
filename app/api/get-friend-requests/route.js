export const dynamic = "force-dynamic";

import connectDB from "../../../lib/mongodb";
import FriendRequest from "../../../models/FriendRequest";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const userId =
      searchParams.get("userId");

    if (!userId) {

      return Response.json({
        success: false,
        message: "Missing userId",
      });

    }

    const requests =
      await FriendRequest.find({
        toUserId: userId,
      });

    return Response.json({
      success: true,
      requests,
    });

  } catch (err) {

    console.log(err);

    return Response.json({
      success: false,
      message: "Server error",
    });

  }
}

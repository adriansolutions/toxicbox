import connectDB from "../../../lib/mongodb";
import FriendRequest from "../../../models/FriendRequest";

export async function POST(req) {
  try {
    await connectDB();

    const {
      fromUserId,
      toUserId,
      username,
      avatar,
    } = await req.json();

    // prevent duplicate requests
    const existing = await FriendRequest.findOne({
      fromUserId,
      toUserId,
    });

    if (existing) {
      return Response.json({
        success: false,
        message: "Request already sent",
      });
    }

    // save request
    await FriendRequest.create({
      fromUserId,
      toUserId,

      // IMPORTANT
      userId: fromUserId,
      username,
      avatar,
    });

    return Response.json({
      success: true,
    });

  } catch (err) {
    console.log(err);

    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}

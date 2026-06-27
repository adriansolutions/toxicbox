import connectDB from "../../../lib/mongodb";

import FriendRequest from "../../../models/FriendRequest";

export async function POST(req) {

  try {

    await connectDB();

    const {
      fromUserId,
      fromUsername,
      fromAvatar,
      toUserId,
    } = await req.json();

    // BLOCK SELF
    if (
      fromUserId === toUserId
    ) {

      return Response.json({
        success: false,
        message:
          "Cannot add yourself",
      });

    }

    // CHECK EXISTING
    const existing =
      await FriendRequest.findOne({
        fromUserId,
        toUserId,
      });

    if (existing) {

      return Response.json({
        success: false,
        message:
          "Request already sent",
      });

    }

    await FriendRequest.create({
      fromUserId,
      fromUsername,
      fromAvatar,
      toUserId,
    });

    return Response.json({
      success: true,
    });

  } catch (err) {

    console.log(err);

    return Response.json({
      success: false,
      message:
        "Server error",
    });

  }

}

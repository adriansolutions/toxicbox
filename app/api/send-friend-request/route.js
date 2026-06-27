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

    // CHECK EXISTING
    const existing =
      await FriendRequest.findOne({
        fromUserId,
        toUserId,
      });

    if (existing) {

      return Response.json({
        success: false,
        message: "Request already sent",
      });

    }

    // SAVE REQUEST
    await FriendRequest.create({

      fromUserId,
      fromUsername: username,
      fromAvatar: avatar || "",

      toUserId,

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

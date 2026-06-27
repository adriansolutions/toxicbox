import connectDB from "../../../lib/mongodb";

import FriendRequest from "../../../models/FriendRequest";

export async function POST(req) {

  try {

    await connectDB();

    const {
      currentUserId,
      fromUserId,
    } = await req.json();

    const request =
      await FriendRequest.findOne({

        toUserId:
          currentUserId,

        fromUserId,

      });

    if (!request) {

      return Response.json({
        success: false,
        message: "Request not found",
      });

    }

    // DELETE REQUEST
    await FriendRequest.deleteOne({
      _id: request._id,
    });

    return Response.json({

      success: true,

      friend: {

        username:
          request.fromUsername,

        userId:
          request.fromUserId,

        avatar:
          request.fromAvatar || "",

      },

    });

  } catch (err) {

    console.log(err);

    return Response.json({
      success: false,
      message: "Server error",
    });

  }

}

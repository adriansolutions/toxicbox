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

    // CHECK EXISTING REQUEST
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

    // CREATE REQUEST
    const request =
      new FriendRequest({

        fromUserId,

        fromUsername:
          username,

        fromAvatar:
          avatar || "",

        toUserId,

      });

    await request.save();

    console.log(
      "REQUEST SAVED:",
      request
    );

    return Response.json({
      success: true,
    });

  } catch (err) {

    console.log(
      "SEND REQUEST ERROR:",
      err
    );

    return Response.json({

      success: false,
      message:
        "Server error",

    });

  }

}

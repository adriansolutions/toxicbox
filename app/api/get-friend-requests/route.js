import connectDB from "../../../lib/mongodb";

import FriendRequest from "../../../models/FriendRequest";

export async function POST(req) {

  try {

    await connectDB();

    const { userId } =
      await req.json();

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
    });

  }

}

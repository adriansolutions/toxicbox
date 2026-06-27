import connectDB from "../../../lib/mongodb";

import FriendRequest from "../../../models/FriendRequest";

import Friend from "../../../models/Friend";

export const dynamic =
  "force-dynamic";

export async function POST(req) {

  try {

    await connectDB();

    const {
      currentUserId,
      fromUserId,
    } = await req.json();

    // CREATE FRIEND
    await Friend.create({
      users: [
        currentUserId,
        fromUserId,
      ],
    });

    // REMOVE REQUEST
    await FriendRequest.deleteOne({
      fromUserId,
      toUserId:
        currentUserId,
    });

    return Response.json({
      success: true,
    });

  } catch (err) {

    console.log(err);

    return Response.json({
      success: false,
    });

  }

}

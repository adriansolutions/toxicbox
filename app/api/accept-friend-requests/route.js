import connectDB from "../../../lib/mongodb";
import FriendRequest from "../../../models/FriendRequest";
import User from "../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { currentUserId, friendUserId } = await req.json();

    // 1. Remove request
    await FriendRequest.deleteOne({
      fromUserId: friendUserId,
      toUserId: currentUserId,
    });

    // 2. Add to BOTH users friend lists
    await User.updateOne(
      { userId: currentUserId },
      { $addToSet: { friends: friendUserId } }
    );

    await User.updateOne(
      { userId: friendUserId },
      { $addToSet: { friends: currentUserId } }
    );

    // 3. Get updated friends
    const user = await User.findOne({ userId: currentUserId });

    const friends = await User.find({
      userId: { $in: user.friends || [] },
    }).select("username userId avatar");

    return Response.json({
      success: true,
      friends,
    });

  } catch (err) {
    console.log(err);
    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}

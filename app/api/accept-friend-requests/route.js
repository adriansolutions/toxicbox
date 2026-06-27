import connectDB from "../../../lib/mongodb";
import FriendRequest from "../../../models/FriendRequest";
import User from "../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { currentUserId, fromUserId } = await req.json();

    if (!currentUserId || !fromUserId) {
      return Response.json({
        success: false,
        message: "Missing user IDs",
      });
    }

    const currentUser = await User.findOne({ userId: currentUserId });
    const senderUser = await User.findOne({ userId: fromUserId });

    if (!currentUser || !senderUser) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 FORCE CLEAN ARRAY (IMPORTANT FIX)
    currentUser.friends = Array.isArray(currentUser.friends)
      ? currentUser.friends
      : [];

    senderUser.friends = Array.isArray(senderUser.friends)
      ? senderUser.friends
      : [];

    // CHECK EXISTING FRIENDS
    const already1 = currentUser.friends.some(
      (f) => f.userId === senderUser.userId
    );

    const already2 = senderUser.friends.some(
      (f) => f.userId === currentUser.userId
    );

    // ADD FRIEND BOTH SIDES
    if (!already1) {
      currentUser.friends.push({
        username: senderUser.username,
        userId: senderUser.userId,
        avatar: senderUser.avatar || "",
      });
    }

    if (!already2) {
      senderUser.friends.push({
        username: currentUser.username,
        userId: currentUser.userId,
        avatar: currentUser.avatar || "",
      });
    }

    // SAVE SAFELY
    await currentUser.save();
    await senderUser.save();

    // REMOVE REQUEST
    await FriendRequest.deleteOne({
      fromUserId,
      toUserId: currentUserId,
    });

    return Response.json({
      success: true,
      friend: {
        username: senderUser.username,
        userId: senderUser.userId,
        avatar: senderUser.avatar || "",
      },
    });

  } catch (err) {
    console.log("ACCEPT FRIEND ERROR:", err);

    return Response.json({
      success: false,
      message: err.message || "Server error",
    });
  }
}

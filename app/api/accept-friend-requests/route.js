import connectDB from "../../../lib/mongodb";

import FriendRequest from "../../../models/FriendRequest";
import User from "../../../models/User";

export async function POST(req) {

  try {

    await connectDB();

    const {
      currentUserId,
      fromUserId,
    } = await req.json();

    // GET USERS
    const currentUser =
      await User.findOne({
        userId: currentUserId,
      });

    const senderUser =
      await User.findOne({
        userId: fromUserId,
      });

    if (!currentUser || !senderUser) {

      return Response.json({
        success: false,
        message: "User not found",
      });

    }

    // FORCE FRIENDS ARRAY
    currentUser.friends =
      currentUser.friends || [];

    senderUser.friends =
      senderUser.friends || [];

    // CURRENT USER ADDS SENDER
    const exists1 =
      currentUser.friends.some(
        (f) =>
          f.userId ===
          senderUser.userId
      );

    if (!exists1) {

      currentUser.friends.push({

        username:
          senderUser.username,

        userId:
          senderUser.userId,

        avatar:
          senderUser.avatar || "",

      });

    }

    // SENDER ADDS CURRENT USER
    const exists2 =
      senderUser.friends.some(
        (f) =>
          f.userId ===
          currentUser.userId
      );

    if (!exists2) {

      senderUser.friends.push({

        username:
          currentUser.username,

        userId:
          currentUser.userId,

        avatar:
          currentUser.avatar || "",

      });

    }

    // IMPORTANT
    currentUser.markModified(
      "friends"
    );

    senderUser.markModified(
      "friends"
    );

    await currentUser.save();

    await senderUser.save();

    // VERIFY SAVE
    const verify1 =
      await User.findOne({
        userId: currentUserId,
      });

    const verify2 =
      await User.findOne({
        userId: fromUserId,
      });

    console.log(
      "CURRENT FRIENDS:",
      verify1.friends
    );

    console.log(
      "SENDER FRIENDS:",
      verify2.friends
    );

    // REMOVE REQUEST
    await FriendRequest.deleteOne({
      fromUserId,
      toUserId:
        currentUserId,
    });

    return Response.json({

      success: true,

      friend: {

        username:
          senderUser.username,

        userId:
          senderUser.userId,

        avatar:
          senderUser.avatar || "",

      },

    });

  } catch (err) {

    console.log(
      "ACCEPT ERROR:",
      err
    );

    return Response.json({
      success: false,
      message: "Server error",
    });

  }

}

import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export const dynamic = "force-dynamic";

export async function POST(req) {

  try {

    await connectDB();

    const body =
      await req.json();

    const userId =
      body.userId;

    const friendId =
      body.friendId;

    if (
      !userId ||
      !friendId
    ) {

      return Response.json({
        success: false,
        message:
          "Missing IDs",
      });

    }

    // =========================
    // FIND USERS
    // =========================

    const user =
      await User.findOne({
        userId,
      });

    const friend =
      await User.findOne({
        userId:
          friendId,
      });

    if (
      !user ||
      !friend
    ) {

      return Response.json({
        success: false,
        message:
          "User not found",
      });

    }

    // =========================
    // ENSURE ARRAYS
    // =========================

    if (
      !Array.isArray(
        user.friends
      )
    ) {

      user.friends = [];

    }

    if (
      !Array.isArray(
        friend.friends
      )
    ) {

      friend.friends = [];

    }

    // =========================
    // REMOVE BOTH SIDES
    // =========================

    user.friends =
      user.friends.filter(
        (f) =>
          f.userId !==
          friendId
      );

    friend.friends =
      friend.friends.filter(
        (f) =>
          f.userId !==
          userId
      );

    // =========================
    // SAVE
    // =========================

    await user.save();

    await friend.save();

    return Response.json({
      success: true,
    });

  } catch (err) {

    console.log(
      "REMOVE FRIEND ERROR:",
      err
    );

    return Response.json({
      success: false,
      message:
        "Server error",
      error:
        err.message,
    });

  }

}

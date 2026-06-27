import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {

  try {

    await connectDB();

    const {
      userId,
      friendId,
    } = await req.json();

    // FIND BOTH USERS
    const user =
      await User.findOne({
        userId,
      });

    const friend =
      await User.findOne({
        userId: friendId,
      });

    if (!user || !friend) {

      return Response.json({
        success: false,
        message: "User not found",
      });

    }

    // REMOVE FRIEND FROM USER
    user.friends =
      (user.friends || []).filter(
        (f) =>
          f.userId !== friendId
      );

    // REMOVE USER FROM FRIEND
    friend.friends =
      (friend.friends || []).filter(
        (f) =>
          f.userId !== userId
      );

    // IMPORTANT
    user.markModified("friends");
    friend.markModified("friends");

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
      message: "Server error",
    });

  }

}

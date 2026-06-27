import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {

  try {

    await connectDB();

    const body = await req.json();
    const search = body?.search?.trim();

    if (!search) {
      return Response.json({
        success: false,
        message: "Search is empty",
      }, { status: 400 });
    }

    const user = await User.findOne({
      $or: [
        {
          username: {
            $regex: search,
            $options: "i",
          },
        },
        {
          userId: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      user: {
        username: user.username,
        userId: user.userId,
        avatar: user.avatar || "",
      },
    });

  } catch (err) {
    console.log("SEARCH USER ERROR:", err);

    return Response.json({
      success: false,
      message: "Server error",
    }, { status: 500 });
  }
}

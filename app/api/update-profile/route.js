import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    const user = await User.findOne({ userId: data.userId });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    // SAFE UPDATE
    Object.keys(data).forEach((key) => {
      if (key !== "userId") {
        user[key] = data[key];
      }
    });

    await user.save();

    return Response.json({
      success: true,
    });

  } catch (err) {
    console.log(err);

    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}

import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    const user = await User.findOne({
      userId: data.userId,
    });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    // UPDATE ALL FIELDS
    user.avatar = data.avatar || user.avatar;
    user.banner = data.banner || user.banner;
    user.bio = data.bio || user.bio;
    user.hometown = data.hometown || "";
    user.birthday = data.birthday || "";
    user.status = data.status || "";
    user.language = data.language || "";
    user.work = data.work || "";
    user.education = data.education || "";
    user.hobbies = data.hobbies || "";
    user.gender = data.gender || "";

    await user.save();

    return Response.json({
      success: true,
      user,
    });

  } catch (err) {
    console.log(err);
    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}

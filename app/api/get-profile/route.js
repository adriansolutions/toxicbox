import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET(req) {

  try {

    await connectDB();

    const { searchParams } =
      new URL(req.url);

    const userId =
      searchParams.get("userId");

    const user =
      await User.findOne({
        userId,
      });

    if (!user) {

      return Response.json({
        success: false,
      });

    }

    return Response.json({
  success: true,
  user: user, // optional compatibility
  profile: user, // keep BOTH safe
});

  } catch (err) {

    console.log(err);

    return Response.json({
      success: false,
    });

  }

}

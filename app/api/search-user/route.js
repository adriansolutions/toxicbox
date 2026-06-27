import connectDB from "../../../lib/mongodb";

import User from "../../../models/User";

export async function POST(req) {

  try {

    await connectDB();

    const { search } =
      await req.json();

    const user =
      await User.findOne({

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
        message:
          "User not found",
      });

    }

    return Response.json({

      success: true,

      user: {

        username:
          user.username,

        userId:
          user.userId,

        avatar:
          user.avatar || "",

      },

    });

  } catch (err) {

    console.log(err);

    return Response.json({

      success: false,

      message:
        "Server error",

    });

  }

}

import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {

  try {

    await connectDB();

    const data =
      await req.json();

    const user =
      await User.findOne({
        userId: data.userId,
      });

    if (!user) {

      return Response.json({
        success: false,
        message: "User not found",
      });

    }

    // =========================
    // BASIC PROFILE
    // =========================

    if (
      data.avatar !== undefined
    ) {

      user.avatar =
        data.avatar;

    }

    if (
      data.banner !== undefined
    ) {

      user.banner =
        data.banner;

    }

    if (
      data.bio !== undefined
    ) {

      user.bio =
        data.bio;

    }

    if (
      data.hometown !== undefined
    ) {

      user.hometown =
        data.hometown;

    }

    if (
      data.birthday !== undefined
    ) {

      user.birthday =
        data.birthday;

    }

    if (
      data.status !== undefined
    ) {

      user.status =
        data.status;

    }

    if (
      data.language !== undefined
    ) {

      user.language =
        data.language;

    }

    if (
      data.gender !== undefined
    ) {

      user.gender =
        data.gender;

    }

    // =========================
    // WORK
    // =========================

    if (
      Array.isArray(
        data.work
      )
    ) {

      user.work =
        data.work;

    }

    // =========================
    // EDUCATION
    // =========================

    if (
      Array.isArray(
        data.education
      )
    ) {

      user.education =
        data.education;

    }

    // =========================
    // HOBBIES
    // =========================

    if (
      Array.isArray(
        data.hobbies
      )
    ) {

      user.hobbies =
        data.hobbies;

    }

    // =========================
    // PINNED DETAILS
    // =========================

    if (
      data.pinnedDetails
    ) {

      user.pinnedDetails =
        data.pinnedDetails;

    }

    // =========================
    // SAVE
    // =========================

    await user.save();

    return Response.json({
      success: true,

      user,
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

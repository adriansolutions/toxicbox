import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export const dynamic = "force-dynamic";

export async function POST(req) {

  try {

    await connectDB();

    const data =
      await req.json();

    if (!data?.userId) {

      return Response.json({
        success: false,
        message:
          "Missing userId",
      });

    }

    const user =
      await User.findOne({
        userId:
          data.userId,
      });

    if (!user) {

      return Response.json({
        success: false,
        message:
          "User not found",
      });

    }

    // =========================
    // STRING FIELDS
    // =========================

    const stringFields = [

      "avatar",
      "banner",
      "bio",
      "hometown",
      "birthday",
      "status",
      "gender",

    ];

    stringFields.forEach(
      (field) => {

        if (
          data[field] !==
          undefined
        ) {

          user[field] =
            data[field];

        }

      }
    );

    // =========================
    // LANGUAGE
    // =========================

    if (
      Array.isArray(
        data.language
      )
    ) {

      user.language =
        data.language
          .slice(0, 5);

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
        data.work
          .slice(0, 3);

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
        data.hobbies
          .slice(0, 5);

    }

    await user.save();

    return Response.json({

      success: true,

      message:
        "Profile updated",

      profile: {

        avatar:
          user.avatar,

        banner:
          user.banner,

        bio:
          user.bio,

        hometown:
          user.hometown,

        birthday:
          user.birthday,

        status:
          user.status,

        gender:
          user.gender,

        language:
          user.language,

        work:
          user.work,

        education:
          user.education,

        hobbies:
          user.hobbies,

      },

    });

  } catch (err) {

    console.log(
      "UPDATE PROFILE ERROR:",
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

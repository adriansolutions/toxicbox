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

    // =========================
    // SAFE UPDATE SYSTEM
    // =========================

    const fields = [
      "avatar",
      "banner",
      "bio",
      "hometown",
      "birthday",
      "status",
      "language",
      "gender",
    ];

    fields.forEach((field) => {
      if (data[field] !== undefined) {
        user[field] = data[field];
      }
    });

    // =========================
    // ARRAY FIELDS (SAFE MERGE)
    // =========================

    if (data.work !== undefined) {
      user.work = data.work;
    }

    if (data.education !== undefined) {
      user.education = data.education;
    }

    if (data.hobbies !== undefined) {
      user.hobbies = data.hobbies;
    }

    await user.save();

    return Response.json({
      success: true,
      profile: user,
    });

  } catch (err) {
    console.log("UPDATE PROFILE ERROR:", err);

    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}

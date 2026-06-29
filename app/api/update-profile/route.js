import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    if (!data?.userId) {
      return Response.json({
        success: false,
        message: "Missing userId",
      });
    }

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
    // STRING FIELDS ONLY
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

    stringFields.forEach((field) => {
      if (data[field] !== undefined) {
        user[field] = String(data[field] || "");
      }
    });

    // =========================
    // ARRAY FIELDS
    // =========================

    // =========================
// FIX OLD BROKEN DATABASE DATA
// =========================

if (!Array.isArray(user.language)) {
  user.language = [];
}

if (!Array.isArray(user.work)) {
  user.work = [];
}

if (!Array.isArray(user.education)) {
  user.education = [];
}

if (!Array.isArray(user.hobbies)) {
  user.hobbies = [];
}

if (!Array.isArray(user.friends)) {
  user.friends = [];
}

    await user.save();

    return Response.json({
      success: true,
      message: "Profile updated",
    });

  } catch (err) {

    console.log(
      "UPDATE PROFILE ERROR:",
      err
    );

    return Response.json({
      success: false,
      message: err.message,
    });
  }
}

import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    let data;

    // ✅ SAFE JSON PARSE (prevents crash)
    try {
      data = await req.json();
    } catch (err) {
      return Response.json({
        success: false,
        message: "Invalid JSON body",
      });
    }

    if (!data?.userId) {
      return Response.json({
        success: false,
        message: "Missing userId",
      });
    }

    const user = await User.findOne({ userId: data.userId });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    // =========================
    // SAFE FIELD UPDATE (NO CRASH)
    // =========================

    const safeUpdate = (field) => {
      if (data[field] !== undefined && data[field] !== null) {
        user[field] = data[field];
      }
    };

    safeUpdate("avatar");
    safeUpdate("banner");
    safeUpdate("bio");
    safeUpdate("hometown");
    safeUpdate("birthday");
    safeUpdate("status");
    safeUpdate("language");
    safeUpdate("gender");
    safeUpdate("work");
    safeUpdate("education");
    safeUpdate("hobbies");

    await user.save();

    return Response.json({
      success: true,
      message: "Profile updated",
    });

  } catch (err) {
    console.log("UPDATE PROFILE ERROR:", err);

    return Response.json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

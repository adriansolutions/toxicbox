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

    const user = await User.findOne({ userId: data.userId });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

if (
  ["bio", "work", "education", "hobbies"].includes(field)
) {
  user[field] = Array.isArray(data[field])
    ? data[field]
    : [];
} else {
  user[field] = data[field];
}

    fields.forEach((f) => {
      if (data[f] !== undefined) user[f] = data[f];
    });

    // ⚠️ FIX ARRAY FIELDS
    if (Array.isArray(data.work)) user.work = data.work;
    if (Array.isArray(data.education)) user.education = data.education;
    if (Array.isArray(data.hobbies)) user.hobbies = data.hobbies;

    await user.save();

    return Response.json({
      success: true,
      message: "Profile updated",
    });

  } catch (err) {
    console.log("UPDATE ERROR:", err);

    return Response.json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

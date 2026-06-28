import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export const dynamic = "force-dynamic";

export async function GET(req) {

try {

await connectDB();

const { searchParams } =
  new URL(req.url);

const userId =
  searchParams.get("userId");

if (!userId) {

  return Response.json({
    success: false,
  });

}

const user =
  await User.findOne({
    userId,
  }).lean();

if (!user) {

  return Response.json({
    success: false,
  });

}

return Response.json({
  success: true,

  user: {
    username:
      user.username || "",

    userId:
      user.userId || "",

    avatar:
      user.avatar || "",

    banner:
      user.banner || "",

    bio:
      user.bio || "",

    hometown:
      user.hometown || "",

    birthday:
      user.birthday || "",

    status:
      user.status || "",

    language:
      user.language || "",

    gender:
      user.gender || "",

    work:
      user.work || "",

    education:
      user.education || "",

    hobbies:
      user.hobbies || "",

    friends:
      user.friends || [],
  },
});

} catch (err) {

console.log(err);

return Response.json({
  success: false,
});

}

}

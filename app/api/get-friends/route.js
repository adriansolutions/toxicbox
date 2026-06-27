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
    friends: [],
  });

}

const user =
  await User.findOne({
    userId,
  });

if (!user) {

  return Response.json({
    success: false,
    friends: [],
  });

}

return Response.json({
  success: true,
  friends:
    user.friends || [],
});

} catch (err) {

console.log(
  "GET FRIENDS ERROR:",
  err
);

return Response.json({
  success: false,
  friends: [],
});

}

}

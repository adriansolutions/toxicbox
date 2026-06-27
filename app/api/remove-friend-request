import connectDB from "../../../lib/mongodb";

import FriendRequest from "../../../models/FriendRequest";

export async function POST(req) {

try {

await connectDB();

const { requestId } =
  await req.json();

await FriendRequest.findByIdAndDelete(
  requestId
);

return Response.json({
  success: true,
});

} catch (err) {

console.log(err);

return Response.json({
  success: false,
});

}

}

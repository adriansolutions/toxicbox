import connectDB from "../../../lib/mongodb";

import User from "../../../models/User";

import FriendRequest from "../../../models/FriendRequest";

export async function POST(req) {

try {

await connectDB();

const {
  currentUserId,
  fromUserId,
} = await req.json();

// FIND USERS
const currentUser =
  await User.findOne({
    userId: currentUserId,
  });

const fromUser =
  await User.findOne({
    userId: fromUserId,
  });

if (
  !currentUser ||
  !fromUser
) {

  return Response.json({
    success: false,
    message: "User not found",
  });

}

// CHECK IF ALREADY FRIENDS
const alreadyFriend =
  currentUser.friends?.find(
    (f) =>
      f.userId === fromUserId
  );

if (!alreadyFriend) {

  // ADD TO CURRENT USER
  currentUser.friends.push({
    username:
      fromUser.username,

    userId:
      fromUser.userId,

    avatar:
      fromUser.avatar || "",
  });

  // ADD TO OTHER USER
  fromUser.friends.push({
    username:
      currentUser.username,

    userId:
      currentUser.userId,

    avatar:
      currentUser.avatar || "",
  });

  await currentUser.save();

  await fromUser.save();

}

// REMOVE FRIEND REQUEST
await FriendRequest.deleteOne({
  fromUserId,
  toUserId: currentUserId,
});

return Response.json({
  success: true,
});

} catch (err) {

console.log(err);

return Response.json({
  success: false,
  message: "Server error",
});

}

}

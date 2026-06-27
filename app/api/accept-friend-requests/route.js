import connectDB from "../../../lib/mongodb";

import User from "../../../models/User";

import FriendRequest from "../../../models/FriendRequest";

export const dynamic =
"force-dynamic";

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

const sender =
  await User.findOne({
    userId: fromUserId,
  });

if (
  !currentUser ||
  !sender
) {

  return Response.json({
    success: false,
    message:
      "User not found",
  });

}

// IMPORTANT FIX
if (
  !currentUser.friends
) {

  currentUser.friends = [];

}

if (
  !sender.friends
) {

  sender.friends = [];

}

// ADD SENDER
const alreadyFriend1 =
  currentUser.friends.find(
    (f) =>
      f.userId ===
      sender.userId
  );

if (
  !alreadyFriend1
) {

  currentUser.friends.push({
    username:
      sender.username,

    userId:
      sender.userId,

    avatar:
      sender.avatar || "",
  });

}

// ADD CURRENT USER
const alreadyFriend2 =
  sender.friends.find(
    (f) =>
      f.userId ===
      currentUser.userId
  );

if (
  !alreadyFriend2
) {

  sender.friends.push({
    username:
      currentUser.username,

    userId:
      currentUser.userId,

    avatar:
      currentUser.avatar || "",
  });

}

await currentUser.save();

await sender.save();

// REMOVE REQUEST
await FriendRequest.deleteOne({
  fromUserId,
  toUserId:
    currentUserId,
});

return Response.json({
  success: true,
});

} catch (err) {

console.log(
  "ACCEPT ERROR:",
  err
);

return Response.json({
  success: false,
  message:
    "Server error",
});

}

}

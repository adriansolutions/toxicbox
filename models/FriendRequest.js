import mongoose from "mongoose";

const FriendRequestSchema =
  new mongoose.Schema({
    fromUserId: String,
    fromUsername: String,
    fromAvatar: String,

    toUserId: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

export default
  mongoose.models.FriendRequest ||
  mongoose.model(
    "FriendRequest",
    FriendRequestSchema
  );

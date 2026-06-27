import mongoose from "mongoose";

const FriendSchema =
  new mongoose.Schema({
    username: String,
    userId: String,
    avatar: String,
  });

const UserSchema =
  new mongoose.Schema({

    username: {
      type: String,
      unique: true,
    },

    userId: String,

    password: String,

    avatar: String,

    online: {
      type: Boolean,
      default: false,
    },

    friends: {
      type: [FriendSchema],
      default: [],
    },

  });

export default
  mongoose.models.User ||
  mongoose.model(
    "User",
    UserSchema
  );

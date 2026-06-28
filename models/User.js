import mongoose from "mongoose";

const FriendSchema =
  new mongoose.Schema({

    username: String,

    userId: String,

    avatar: String,

  }, {
    _id: false,
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

    // NEW PROFILE SYSTEM
    banner: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    hometown: {
      type: String,
      default: "",
    },

    birthday: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "",
    },

    work: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    hobbies: {
      type: String,
      default: "",
    },

    online: {
      type: Boolean,
      default: false,
    },

    // IMPORTANT FIX
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

import mongoose from "mongoose";

/* =========================
   FRIENDS
========================= */
const FriendSchema = new mongoose.Schema(
  {
    username: String,
    userId: String,
    avatar: String,
  },
  { _id: false }
);

/* =========================
   USER SCHEMA
========================= */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

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

    gender: {
      type: String,
      default: "",
    },

    online: {
      type: Boolean,
      default: false,
    },

    /* =========================
       ARRAY FIELDS
    ========================= */

    language: {
      type: [String],
      default: [],
    },

    work: {
      type: [String],
      default: [],
    },

    education: {
      type: [String],
      default: [],
    },

    hobbies: {
      type: [String],
      default: [],
    },

    friends: {
      type: [FriendSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);

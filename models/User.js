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
   WORK
========================= */
const WorkSchema = new mongoose.Schema(
  {
    workplace: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    currentlyWorking: { type: Boolean, default: false },

    startMonth: { type: String, default: "" },
    startYear: { type: String, default: "" },
    endMonth: { type: String, default: "" },
    endYear: { type: String, default: "" },

    description: { type: String, default: "" },
  },
  { _id: false }
);

/* =========================
   EDUCATION
========================= */
const EducationSchema = new mongoose.Schema(
  {
    school: { type: String, default: "" },
    type: { type: String, default: "" },
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

    /* =========================
       PROFILE MEDIA
    ========================= */
    avatar: { type: String, default: "" },
    banner: { type: String, default: "" },

    /* =========================
       BASIC PROFILE INFO
    ========================= */
    bio: { type: String, default: "" },
    hometown: { type: String, default: "" },
    birthday: { type: String, default: "" },
    status: { type: String, default: "" },
    language: {
  type: [String],
  default: [],
},
    gender: { type: String, default: "" },

    online: { type: Boolean, default: false },

    /* =========================
       DYNAMIC PROFILE DATA
    ========================= */
    work: {
      type: [WorkSchema],
      default: [],
    },

    education: {
      type: [EducationSchema],
      default: [],
    },

    hobbies: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length <= 10;
        },
        message: "Max 10 hobbies only",
      },
    },

    /* =========================
       PINNED SYSTEM
    ========================= */
    pinnedDetails: {
      work: { type: [Number], default: [] },
      education: { type: [Number], default: [] },
      hobbies: { type: [Number], default: [] },
    },

    /* =========================
       FRIENDS
    ========================= */
    friends: {
      type: [FriendSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   SAFETY FIX (PREVENT CRASHES)
========================= */
UserSchema.pre("save", function (next) {
  if (!Array.isArray(this.hobbies)) this.hobbies = [];
  if (!Array.isArray(this.work)) this.work = [];
  if (!Array.isArray(this.education)) this.education = [];

  next();
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);

import mongoose from "mongoose";

const FriendSchema =
  new mongoose.Schema({

    username: String,

    userId: String,

    avatar: String,

  }, {
    _id: false,
  });

const WorkSchema =
  new mongoose.Schema({

    workplace: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    startMonth: {
      type: String,
      default: "",
    },

    startYear: {
      type: String,
      default: "",
    },

    endMonth: {
      type: String,
      default: "",
    },

    endYear: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

  }, {
    _id: false,
  });

const EducationSchema =
  new mongoose.Schema({

    school: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "",
    },

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

    language: {
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

    // WORK LIST
    work: {
      type: [WorkSchema],
      default: [],
    },

    // EDUCATION LIST
    education: {
      type: [EducationSchema],
      default: [],
    },

    // HOBBIES LIST
    hobbies: {
      type: [String],
      default: [],
    },

    // PINNED DETAILS
    pinnedDetails: {
      work: {
        type: [Number],
        default: [],
      },

      education: {
        type: [Number],
        default: [],
      },

      hobbies: {
        type: [Number],
        default: [],
      },
    },

    // FRIENDS
    friends: {
      type: [FriendSchema],
      default: [],
    },

  }, {
    timestamps: true,
  });

export default
  mongoose.models.User ||
  mongoose.model(
    "User",
    UserSchema
  );

import { NextResponse }
from "next/server";

import bcrypt
from "bcryptjs";

import dbConnect
from "../../../lib/mongodb";

import User from "../../../models/User";

export async function POST(
req
) {

try {

await dbConnect();

const {
  username,
  password,
} = await req.json();

const existingUser =
  await User.findOne({
    username,
  });

if (existingUser) {

  return NextResponse.json({
    success: false,

    message:
      "Username already taken",

    suggestions: [

      username + "123",

      username + "_official",

      username +
      Math.floor(
        Math.random() * 999
      ),

    ],
  });

}

const hashedPassword =
  await bcrypt.hash(
    password,
    10
  );

const userId =
  "BC-" +
  Math.floor(
    100000 +
    Math.random() *
    900000
  );

const avatar =
  `https://ui-avatars.com/api/?name=${username}`;

const user =
  await User.create({

    username,

    password:
      hashedPassword,

    userId,

    avatar,

    // FIXES
    language: [],
    work: [],
    education: [],
    hobbies: [],
    friends: [],

    bio: "",
    hometown: "",
    birthday: "",
    status: "",
    gender: "",

    banner: "",

  });

return NextResponse.json({

  success: true,

  user: {

    username:
      user.username,

    userId:
      user.userId,

    avatar:
      user.avatar,

  },

});

} catch (err) {

return NextResponse.json({

  success: false,

  message:
    "Register failed",

});

}

}

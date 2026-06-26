import { NextResponse }
from "next/server";

import bcrypt
from "bcryptjs";

import jwt
from "jsonwebtoken";

import dbConnect
from "@/lib/mongodb";

import User
from "@/models/User";

export async function POST(
req
) {

try {

await dbConnect();

const {
  username,
  password,
} = await req.json();

const user =
  await User.findOne({
    username,
  });

if (!user) {

  return NextResponse.json({
    success: false,
    message:
      "User not found",
  });

}

const valid =
  await bcrypt.compare(
    password,
    user.password
  );

if (!valid) {

  return NextResponse.json({
    success: false,
    message:
      "Wrong password",
  });

}

const token =
  jwt.sign(

    {
      userId:
        user.userId,
    },

    "bluechat-secret",

    {
      expiresIn: "7d",
    }

  );

return NextResponse.json({

  success: true,

  token,

  user: {

    username:
      user.username,

    userId:
      user.userId,

    avatar:
      user.avatar,

  },

});

} catch {

return NextResponse.json({

  success: false,

  message:
    "Login failed",

});

}

}

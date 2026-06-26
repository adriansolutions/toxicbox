import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";

export async function POST(req) {

  try {

    const body =
      await req.json();

    const {
      currentPassword,
      newPassword,
    } = body;

    const auth =
      req.headers.get(
        "authorization"
      );

    if (!auth) {

      return NextResponse.json({
        success: false,
        message:
          "Not logged in",
      });

    }

    const token =
      auth.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    const client =
      await clientPromise;

    const db =
      client.db("bluechat");

    const user =
      await db
        .collection("users")
        .findOne({
          _id:
            decoded.id,
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
        currentPassword,
        user.password
      );

    if (!valid) {

      return NextResponse.json({
        success: false,
        message:
          "Wrong current password",
      });

    }

    const hashed =
      await bcrypt.hash(
        newPassword,
        10
      );

    await db
      .collection("users")
      .updateOne(
        {
          _id:
            user._id,
        },
        {
          $set: {
            password:
              hashed,
          },
        }
      );

    return NextResponse.json({
      success: true,
      message:
        "Password updated",
    });

  } catch {

    return NextResponse.json({
      success: false,
      message:
        "Server error",
    });

  }

}

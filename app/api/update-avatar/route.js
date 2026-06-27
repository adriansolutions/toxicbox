import { NextResponse } from "next/server";

import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {

  try {

    await connectDB();

    const {
      userId,
      avatar,
    } = await req.json();

    await User.findOneAndUpdate(
      { userId },
      {
        avatar,
      }
    );

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    return NextResponse.json({
      success: false,
    });

  }

}

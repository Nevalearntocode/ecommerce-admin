import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password }: { email: string; password: string } =
      await req.json();

    if (!email) {
      return new NextResponse("email is required.", { status: 400 });
    }

    if (!password) {
      return new NextResponse("password is required.", { status: 400 });
    }

    if (password.length < 8) {
      return new NextResponse("password needs to be at least 8 characters.", {
        status: 400,
      });
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await db.user.create({
      data: {
        email,
        hashedPassword,
        name: "",
        image: "",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(newUser);

    return NextResponse.json({
      success: "Account created",
      newUser,
    });
  } catch (error) {
    console.log("[REGISTER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

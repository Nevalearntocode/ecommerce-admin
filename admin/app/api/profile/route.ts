import { NextResponse } from "next/server";
import getCurrentUser from "@/lib/get-current-user";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();

    const { name, image }: { name: string; image: string } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        image,
      },
      select: {
        name: true,
        image: true,
      },
    });

    return NextResponse.json({
      success: "Profile updated!",
      updatedUser,
    });
  } catch (error) {
    console.log("[PATCH_PROFILE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

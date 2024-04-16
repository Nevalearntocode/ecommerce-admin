import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    console.log(params.storeSlug);

    await db.store.update({
      where: {
        slug: params.storeSlug,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json({
      success: "Invite code changed, refresh to accquired new invite code",
    });
  } catch (error) {
    console.log("[NEW INVITE CODE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

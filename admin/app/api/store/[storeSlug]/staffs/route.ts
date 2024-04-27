import getCurrentUser from "@/data/get-current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!params.storeSlug) {
      return new Response("Store slug is required.", { status: 400 });
    }

    const existingStore = await db.store.findUnique({
      where: {
        slug: params.storeSlug,
      },
      include: {
        staffs: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (!existingStore.staffs.length) {
      return new NextResponse("You are not a staff of this store", { status: 403 });
    }

    const staff = existingStore.staffs[0];
    // check if the user is the owner of the store

    await db.staff.delete({
      where: {
        id: staff.id,
      },
    });

    return NextResponse.json({ success: "You have left the store." });

  } catch (error) {
    console.log("[STAFF ROLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { v4 as uuidv4 } from "uuid";
import { getStoreWithCurrentStaff } from "@/lib/get-stores";
import { canManageStaff } from "@/lib/permission-hierarchy";

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

    const existingStore = await getStoreWithCurrentStaff(
      params.storeSlug,
      user.id,
    );

    if (!existingStore) {
      return NextResponse.json("Store not found.", { status: 404 });
    }

    const staff = existingStore.staffs[0];

    const isAuthorized =
      canManageStaff(staff) || user.id === existingStore.userId;

    if (!isAuthorized) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    await db.store.update({
      where: {
        slug: params.storeSlug,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json({
      success: "New invite link generated.",
    });
  } catch (error) {
    console.log("[NEW INVITE CODE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

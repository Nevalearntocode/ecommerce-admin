import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { getBillboardById } from "@/lib/get-store-billboards";
import { getStoreWithCurrentStaff } from "@/lib/get-user-stores";
import { canManageBillboard } from "@/lib/permission-hierarchy";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeSlug: string; billboardId: string } },
) {
  try {
    const user = await getCurrentUser();
    const { storeSlug, billboardId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }
    const staff = existingStore.staffs[0];

    const isAuthorized = canManageBillboard(staff);

    if (!isAuthorized) {
      return new NextResponse(
        "You don't have permission to perform this action.",
        { status: 403 },
      );
    }

    const existingBillboard = await getBillboardById(billboardId);

    if (!existingBillboard) {
      return new NextResponse("Billboard not found.", { status: 404 });
    }

    await db.billboard.delete({
      where: {
        id: existingBillboard.id,
      },
    });

    return NextResponse.json({ success: "Billboard deleted." });
  } catch (error) {
    console.log("[LISTING_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

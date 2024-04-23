import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { getBillboardById } from "@/data/get-billboards";
import { getStoreWithCurrentStaff } from "@/data/get-stores";
import {
  canManageBillboard,
  isOwner,
} from "@/permissions/permission-hierarchy";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string; billboardId: string } },
) {
  try {
    const user = await getCurrentUser();
    const { image, name }: { image?: string; name?: string } = await req.json();
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

    if (
      (!existingStore.staffs[0] ||
        !canManageBillboard(existingStore.staffs[0])) &&
      !isOwner(user.id, existingStore.userId)
    ) {
      return new NextResponse(
        "You don't have permission to perform this action.",
        { status: 403 },
      );
    }

    const existingBillboard = await getBillboardById(billboardId);

    if (!existingBillboard) {
      return new NextResponse("Billboard not found.", { status: 404 });
    }

    const updateData = {
      image: image ? image : existingBillboard.image,
      name: name ? name : existingBillboard.name,
    };

    if (
      existingBillboard.name === updateData.name &&
      existingBillboard.image === updateData.image
    ) {
      return new NextResponse("Billboard has not changed.", { status: 200 });
    }

    const hasNameConflictBillboard = await db.billboard.findUnique({
      where: {
        name_storeId: {
          storeId: existingStore.id,
          name: updateData.name,
        },
        NOT: [
          {
            id: existingBillboard.id,
          },
        ],
      },
    });

    if (hasNameConflictBillboard) {
      return new NextResponse(
        `A billboard with the name '${updateData.name}' already exists in this store.`,
        { status: 409 },
      );
    }

    const newBillboard = await db.billboard.update({
      where: {
        id: existingBillboard.id,
      },
      data: { ...updateData },
    });

    return NextResponse.json({
      success: "Billboard updated.",
      billboard: newBillboard,
    });
  } catch (error) {
    console.log("[BILLBOARD PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
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

    if (
      (!existingStore.staffs[0] ||
        !canManageBillboard(existingStore.staffs[0])) &&
      !isOwner(user.id, existingStore.userId)
    ) {
      return new NextResponse(
        "You don't have permission to perform this action.",
        { status: 403 },
      );
    }

    const existingBillboard = await getBillboardById(billboardId);

    if (!existingBillboard) {
      return new NextResponse("Billboard not found.", { status: 404 });
    }

    if (existingBillboard.categories.length !== 0) {
      return new NextResponse(
        "Please remove all categories associated with this billboard before deleting it..",
        { status: 400 },
      );
    }

    await db.billboard.delete({
      where: {
        id: existingBillboard.id,
      },
    });

    return NextResponse.json({ success: "Billboard deleted." });
  } catch (error) {
    console.log("[BILLBOARD DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } },
) {
  try {
    const { billboardId } = params;

    if (!billboardId) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    const billboard = await getBillboardById(params.billboardId);

    if (!billboard) {
      return new NextResponse("Billboard not found.", { status: 404 });
    }

    return NextResponse.json(billboard);
  } catch (error: any) {
    console.log("[GET BILLBOARD BY ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

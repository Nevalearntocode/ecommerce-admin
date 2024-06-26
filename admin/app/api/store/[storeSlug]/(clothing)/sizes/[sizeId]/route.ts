import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { getSizeById } from "@/data/get-sizes";
import { getStoreWithCurrentStaff } from "@/data/get-stores";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import { SizeValue } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string; sizeId: string } },
) {
  try {
    const user = await getCurrentUser();

    const { value, name }: { value?: SizeValue; name?: string } =
      await req.json();

    const { storeSlug, sizeId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (
      (!existingStore.staffs[0] ||
        !canManageProduct(existingStore.staffs[0])) &&
      !isOwner(user.id, existingStore.userId)
    ) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    const existingSize = await getSizeById(sizeId);

    if (!existingSize) {
      return new NextResponse("Size not found.", { status: 404 });
    }

    const updateData = {
      name: name ? name : existingSize.name,
      value: value ? value : existingSize.value,
    };

    if (
      updateData.name == existingSize.name &&
      updateData.value == existingSize.value
    ) {
      return new NextResponse("Size has not changed.", { status: 200 });
    }

    // check if there is already a size with this name in store
    const existingSizeWithName = await db.size.findFirst({
      where: {
        name: updateData.name,
        storeId: existingStore.id,
      },
    });

    if (existingSizeWithName && existingSizeWithName.id !== existingSize.id) {
      return new NextResponse("Size already exists.", { status: 400 });
    }

    const newSize = await db.size.update({
      where: {
        id: existingSize.id,
      },
      data: { ...updateData },
    });

    return NextResponse.json({
      success: "Size updated.",
      size: newSize,
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeSlug: string; sizeId: string } },
) {
  try {
    const user = await getCurrentUser();
    const { storeSlug, sizeId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (
      (!existingStore.staffs[0] ||
        !canManageProduct(existingStore.staffs[0])) &&
      !isOwner(user.id, existingStore.userId)
    ) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    const existingSize = await getSizeById(sizeId);

    if (!existingSize) {
      return new NextResponse("Size not found.", { status: 404 });
    }

    await db.size.delete({
      where: {
        id: existingSize.id,
      },
    });

    return NextResponse.json({
      success: "Size deleted.",
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } },
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size ID is required.", { status: 400 });
    }
    const size = await getSizeById(params.sizeId);

    if (!size) {
      return new NextResponse("No sizes found.", { status: 404 });
    }

    return NextResponse.json(size);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

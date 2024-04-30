import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { getColorById } from "@/data/get-colors";
import { getStoreWithCurrentStaff } from "@/data/get-stores";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import { NextResponse } from "next/server";
import { expandHexCode } from "@/lib/convert-hex-code";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string; colorId: string } },
) {
  try {
    const user = await getCurrentUser();

    const { value, name }: { value?: string; name?: string } = await req.json();

    const { storeSlug, colorId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required.", { status: 400 });
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

    const existingColor = await getColorById(colorId);

    if (!existingColor) {
      return new NextResponse("Color not found.", { status: 404 });
    }

    const updateData = {
      name: name ? name.toLowerCase() : existingColor.name,
      value: value ? value : existingColor.value,
    };

    if (updateData.value.length === 4) {
      updateData.value = expandHexCode(updateData.value);
    }

    if (
      updateData.name == existingColor.name &&
      updateData.value == existingColor.value
    ) {
      return new NextResponse("Color has not changed.", { status: 200 });
    }

    const newColor = await db.color.update({
      where: {
        id: existingColor.id,
      },
      data: { ...updateData },
    });

    return NextResponse.json({
      success: "Color updated.",
      color: newColor,
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeSlug: string; colorId: string } },
) {
  try {
    const user = await getCurrentUser();
    const { storeSlug, colorId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required.", { status: 400 });
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

    const existingColor = await getColorById(colorId);

    if (!existingColor) {
      return new NextResponse("Color not found.", { status: 404 });
    }

    await db.color.delete({
      where: {
        id: existingColor.id,
      },
    });

    return NextResponse.json({
      success: "Color deleted.",
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } },
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color ID is required.", { status: 400 });
    }
    const color = await getColorById(params.colorId);

    if (!color) {
      return new NextResponse("No colors found.", { status: 404 });
    }

    return NextResponse.json(color);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

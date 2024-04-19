import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { getColorById } from "@/lib/get-colors";
import { getStoreWithCurrentStaff } from "@/lib/get-stores";
import { canManageProduct } from "@/lib/permission-hierarchy";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string; colorId: string } },
) {
  try {
    const user = await getCurrentUser();

    const { value, name }: { value?: string; name?: string } =
      await req.json();

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

    const staff = existingStore.staffs[0];

    if (!staff || !canManageProduct(staff)) {
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
      name: name ? name : existingColor.name,
      value: value ? value : existingColor.value,
    };

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
    console.log("[COLOR DELETE]", error);
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

    const staff = existingStore.staffs[0];

    if (!staff || !canManageProduct(staff)) {
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
    console.log("[COLOR DELETE]", error);
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
    console.log("[POST COLOR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

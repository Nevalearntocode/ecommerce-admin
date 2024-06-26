import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { getTypeById } from "@/data/get-types";
import { getStoreWithCurrentStaff } from "@/data/get-stores";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string; typeId: string } },
) {
  try {
    const user = await getCurrentUser();

    const { value, name }: { value?: string; name?: string } = await req.json();

    const { storeSlug, typeId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!typeId) {
      return new NextResponse("Type id is required.", { status: 400 });
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

    const existingType = await getTypeById(typeId);

    if (!existingType) {
      return new NextResponse("Type not found.", { status: 404 });
    }

    const updateData = {
      name: name ? name : existingType.name,
      value: value ? value : existingType.value,
    };

    if (
      updateData.name == existingType.name &&
      updateData.value == existingType.value
    ) {
      return new NextResponse("Type has not changed.", { status: 200 });
    }

    const existingTypeWithName = await db.type.findFirst({
      where: {
        name: updateData.name,
        storeId: existingStore.id,
      },
    });

    if (existingTypeWithName) {
      return new NextResponse("Type already exists.", { status: 409 });
    }

    const newType = await db.type.update({
      where: {
        id: existingType.id,
      },
      data: { ...updateData },
    });

    return NextResponse.json({
      success: "Type updated.",
      type: newType,
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeSlug: string; typeId: string } },
) {
  try {
    const user = await getCurrentUser();
    const { storeSlug, typeId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!typeId) {
      return new NextResponse("Type id is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    const staff = existingStore.staffs[0];

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

    const existingType = await getTypeById(typeId);

    if (!existingType) {
      return new NextResponse("Type not found.", { status: 404 });
    }

    await db.type.delete({
      where: {
        id: existingType.id,
      },
    });

    return NextResponse.json({
      success: "Type deleted.",
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { typeId: string } },
) {
  try {
    if (!params.typeId) {
      return new NextResponse("Type ID is required.", { status: 400 });
    }
    const type = await getTypeById(params.typeId);

    if (!type) {
      return new NextResponse("No types found.", { status: 404 });
    }

    return NextResponse.json(type);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

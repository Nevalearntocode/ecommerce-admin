import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { getStoreWithCurrentStaff } from "@/data/get-stores";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";

export async function POST(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    const { name, value }: { name: string; value: string } = await req.json();

    const { storeSlug } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required.", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Type value is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (existingStore.storeType !== "TECHNOLOGY") {
      return new NextResponse(
        "Type is not a valid attribute for this product. Please use relevant attributes.",
        { status: 400 },
      );
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

    const newType = await db.type.create({
      data: {
        name: name.toLowerCase(),
        value,
        storeId: existingStore.id,
      },
    });

    return NextResponse.json({ success: "Type created.", newType });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const { storeSlug } = params;

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    const existingStore = await db.store.findUnique({
      where: {
        slug: storeSlug,
      },
      include: {
        types: {
          orderBy: {
            value: "asc",
          },
        },
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (existingStore.storeType !== "TECHNOLOGY") {
      return new NextResponse(
        "Type is not a valid attribute for this product. Please use relevant attributes.",
        { status: 400 },
      );
    }

    return NextResponse.json(existingStore.types);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { SizeValue } from "@prisma/client";
import { getStoreWithCurrentStaff } from "@/data/get-stores";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";

export async function POST(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    const { name, value }: { name: string; value: SizeValue } =
      await req.json();

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
      return new NextResponse("Size value is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (existingStore.storeType !== "CLOTHING") {
      return new NextResponse(
        "Size is not a valid attribute for this store. Please use relevant attributes.",
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

    const existingSize = await db.size.findFirst({
      where: {
        name,
        storeId: existingStore.id,
      },
    });

    if (existingSize) {
      return new NextResponse("Size already exists.", { status: 400 });
    }

    const newSize = await db.size.create({
      data: {
        name,
        value,
        storeId: existingStore.id,
      },
    });

    return NextResponse.json({ success: "Size created.", newSize });
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
    const { searchParams } = new URL(req.url);
    const sizeName = searchParams.get("size") || undefined;

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    const existingStore = await db.store.findUnique({
      where: {
        slug: storeSlug,
      },
      include: {
        sizes: {
          where: {
            name: {
              equals: sizeName,
              mode: "insensitive",
            },
          },
          orderBy: {
            value: "asc",
          },
        },
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (existingStore.storeType !== "CLOTHING") {
      return new NextResponse(
        "Size is not a valid attribute for this product. Please use relevant attributes.",
        { status: 400 },
      );
    }

    return NextResponse.json(existingStore.sizes);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

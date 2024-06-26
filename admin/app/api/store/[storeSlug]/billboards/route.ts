import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { getStoreWithCurrentStaff } from "@/data/get-stores";
import {
  canManageBillboard,
  canManageCategory,
  isOwner,
} from "@/permissions/permission-hierarchy";

export async function POST(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    const { image, name }: { image: string; name: string } = await req.json();
    const { storeSlug } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!name) {
      return new NextResponse("name is required.", { status: 400 });
    }

    if (!image) {
      return new NextResponse("image is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (
      (!existingStore.staffs[0] ||
        !canManageCategory(existingStore.staffs[0])) &&
      !isOwner(user.id, existingStore.userId)
    ) {
      return new NextResponse(
        "You don't have permission to perform this action.",
        { status: 403 },
      );
    }

    const existingBillboard = await db.billboard.findUnique({
      where: {
        name_storeId: {
          storeId: existingStore.id,
          name,
        },
      },
    });

    if (existingBillboard) {
      return new NextResponse(
        `A billboard with the name '${name}' already exists in this store.`,
        { status: 409 },
      );
    }

    const billboard = await db.billboard.create({
      data: {
        image,
        name,
        storeId: existingStore.id,
      },
    });

    return NextResponse.json({
      success: "Billboard created.",
      billboard: billboard,
    });
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
        billboards: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    return NextResponse.json({ billboards: existingStore.billboards });
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

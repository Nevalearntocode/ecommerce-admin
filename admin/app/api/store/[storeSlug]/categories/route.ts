import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { getStoreWithCurrentStaff } from "@/data/get-stores";
import { canManageCategory, isOwner } from "@/permissions/permission-hierarchy";
import { getBillboardByNameAndStoreId } from "@/data/get-billboards";

export async function POST(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    const {
      billboardName,
      name,
      slug,
    }: { billboardName: string; name: string; slug: string } = await req.json();
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

    if (!billboardName) {
      return new NextResponse("Billboard is required.", { status: 400 });
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

    const existingBillboard = await getBillboardByNameAndStoreId(
      billboardName,
      existingStore.id,
    );

    if (!existingBillboard) {
      return new NextResponse("Billboard not found.", { status: 404 });
    }

    const defaultSlug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const updateData = {
      slug: slug === "" ? defaultSlug : slug,
    };
    const existingCategoryName = await db.category.findUnique({
      where: {
        name_storeId: {
          storeId: existingStore.id,
          name,
        },
      },
    });

    if (existingCategoryName) {
      return new NextResponse(
        `A category with the name '${name}' already exists in this store.`,
        { status: 409 },
      );
    }

    const existingCategorySlug = await db.category.findUnique({
      where: {
        slug_storeId: {
          storeId: existingStore.id,
          slug: updateData.slug,
        },
      },
    });

    if (existingCategorySlug) {
      return new NextResponse(
        `A category with the slug '${updateData.slug}' already exists in this store.`,
        { status: 409 },
      );
    }

    const category = await db.category.create({
      data: {
        name,
        slug: updateData.slug,
        storeId: existingStore.id,
        billboardId: existingBillboard.id,
      },
    });

    return NextResponse.json({
      success: "Category created.",
      category,
    });
  } catch (error) {
    console.log("[CREATE CATEGORY]", error);
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
        categories: {
          include: {
            billboard: true
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    return NextResponse.json(existingStore.categories);
  } catch (error: any) {
    console.log("[GET CATEGORIES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

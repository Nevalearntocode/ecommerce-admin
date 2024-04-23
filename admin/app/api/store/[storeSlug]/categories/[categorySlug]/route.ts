import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { getStoreWithCurrentStaff } from "@/lib/get-stores";
import {
  canManageCategory,
  canManageStore,
  isOwner,
} from "@/lib/permission-hierarchy";
import { getBillboardByNameAndStoreId } from "@/lib/get-billboards";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string; categorySlug: string } },
) {
  try {
    const user = await getCurrentUser();

    const {
      billboardName,
      name,
      slug,
    }: { billboardName: string; name?: string; slug?: string } =
      await req.json();
    const { storeSlug, categorySlug } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!categorySlug) {
      return new NextResponse("Category slug is required.", { status: 400 });
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

    const existingCategory = await db.category.findUnique({
      where: {
        slug_storeId: {
          storeId: existingStore.id,
          slug: categorySlug,
        },
      },
    });

    if (!existingCategory) {
      return new NextResponse("Category not found.", { status: 404 });
    }

    const updateData = {
      name: name || name === "" ? name : existingCategory.name,
      slug: slug ? slug : existingCategory.slug,
    };

    if (!slug || slug === "") {
      updateData.slug = updateData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    }

    if (
      existingCategory.name === updateData.name &&
      existingCategory.slug === updateData.slug
    ) {
      return new NextResponse("Category has not changed.", {
        status: 200,
      });
    }

    const existingCategoryName = await db.category.findUnique({
      where: {
        name_storeId: {
          name: updateData.name,
          storeId: existingStore.id,
        },
        NOT: [
          {
            id: existingCategory.id,
          },
        ],
      },
    });

    if (existingCategoryName) {
      return new NextResponse(
        `A category with the name '${updateData.name}' already exists in this store.`,
        { status: 409 },
      );
    }
    const existingCategorySlug = await db.category.findUnique({
      where: {
        slug_storeId: {
          slug: updateData.slug,
          storeId: existingStore.id,
        },
        NOT: [
          {
            id: existingCategory.id,
          },
        ],
      },
    });

    if (existingCategorySlug) {
      return new NextResponse(
        `A category with the slug '${updateData.slug}' already exists in this store.`,
        { status: 409 },
      );
    }

    const category = await db.category.update({
      where: {
        id: existingCategory.id,
      },
      data: {
        ...updateData,
      },
    });

    return NextResponse.json({
      success: "Category updated.",
      category,
    });
  } catch (error) {
    console.log("[UPDATE CATEGORY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeSlug: string; categorySlug: string } },
) {
  try {
    const user = await getCurrentUser();

    const { categorySlug, storeSlug } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!categorySlug) {
      return new NextResponse("Category slug is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (
      (!existingStore.staffs[0] || !canManageStore(existingStore.staffs[0])) &&
      !isOwner(user.id, existingStore.userId)
    ) {
      return new NextResponse(
        "You don't have permission to perform this action.",
        { status: 403 },
      );
    }

    const existingCategory = await db.category.findUnique({
      where: {
        slug_storeId: {
          storeId: existingStore.id,
          slug: categorySlug,
        },
      },
    });

    if (!existingCategory) {
      return new NextResponse("Category not found.", { status: 404 });
    }

    await db.category.delete({
      where: {
        id: existingCategory.id,
      },
    });

    return NextResponse.json({ success: "Category deleted." });
  } catch (error) {
    console.log("[DELETE CATEGORY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeSlug: string; categorySlug: string } },
) {
  try {
    const { categorySlug, storeSlug } = params;

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!categorySlug) {
      return new NextResponse("Category slug is required.", { status: 400 });
    }

    const existingStore = await db.store.findUnique({
      where: {
        slug: storeSlug,
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    const category = await db.category.findUnique({
      where: {
        slug_storeId: {
          storeId: existingStore.id,
          slug: categorySlug,
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[GET CATEGORY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

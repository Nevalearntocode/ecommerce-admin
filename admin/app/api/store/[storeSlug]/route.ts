import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { canManageStore, isOwner } from "@/permissions/permission-hierarchy";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    const {
      name,
      slug,
      image,
    }: { name?: string; slug?: string; image?: string } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    const existingStore = await db.store.findUnique({
      where: {
        slug: params.storeSlug,
      },
      include: {
        staffs: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (
      (!existingStore.staffs[0] || !canManageStore(existingStore.staffs[0])) &&
      !isOwner(user.id, existingStore.userId)
    ) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    const updateData = {
      name: name ? name : existingStore.name,
      slug: slug ? slug : "",
      image: image ? image : "",
    };

    if (!slug) {
      updateData.slug = existingStore.slug;
    }

    if (slug === "") {
      updateData.slug = updateData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    }

    if (!image || image === "") {
      updateData.image = existingStore.image;
    }

    const existedStoreWithGivenName = await db.store.findFirst({
      where: {
      name: {
        equals: updateData.name,
        mode: "insensitive",
      },
      NOT: {  
        id: existingStore.id,
      },
      },
    });

    if (existedStoreWithGivenName) {
      return new NextResponse(`Store with name: ${name} already exists`, {
      status: 400,
      });
    }

    const existedStoreWithGivenSlug = await db.store.findUnique({
      where: {
        slug: updateData.slug,
        NOT: [
          {
            id: existingStore.id,
          },
        ],
      },
    });

    if (existedStoreWithGivenSlug) {
      return new NextResponse(`Store with slug: ${slug} already exists`, {
        status: 400,
      });
    }

    const newStore = await db.store.update({
      where: {
        id: existingStore.id,
      },
      data: { ...updateData },
    });

    return NextResponse.json({
      success: "Store updated",
      newStore,
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    const existingStore = await db.store.findUnique({
      where: {
        slug: params.storeSlug,
      },
      include: {
        staffs: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const staff = existingStore.staffs[0];

    if (!staff || !isOwner(user.id, existingStore.userId)) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    await db.store.delete({
      where: {
        id: existingStore.id,
      },
    });
    return NextResponse.json({
      success: "Store deleted.",
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
    if (!params.storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    const store = await db.store.findUnique({
      where: {
        slug: params.storeSlug,
      },
    });

    if (!store) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error: any) {
    return new NextResponse("Internal Eror", { status: 500 });
  }
}

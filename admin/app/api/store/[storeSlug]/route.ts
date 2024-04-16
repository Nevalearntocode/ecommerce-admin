import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    const { name, slug }: { name: string; slug: string } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required.", { status: 400 });
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

    const { canManageStore, isAdmin } = existingStore.staffs[0];

    if (!canManageStore && !isAdmin && user.id !== existingStore.userId) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    const existedStoreWithGivenName = await db.store.findUnique({
      where: {
        name,
      },
      select: {
        id: true,
      },
    });

    if (
      existedStoreWithGivenName &&
      existedStoreWithGivenName.id !== existingStore.id
    ) {
      return new NextResponse(`Store with name: ${name} already exists`, {
        status: 400,
      });
    }

    const existedStoreWithGivenSlug = await db.store.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (
      existedStoreWithGivenSlug &&
      existedStoreWithGivenSlug.id !== existingStore.id
    ) {
      return new NextResponse(`Store with slug: ${slug} already exists`, {
        status: 400,
      });
    }

    const defaultSlug = name.toLowerCase().trim().replace(/\s+/g, "-");

    // admin
    const newStore = await db.store.update({
      where: {
        id: existingStore.id,
      },
      data: {
        name,
        slug: slug === "" ? defaultSlug : slug,
      },
    });

    return NextResponse.json({
      success: "Store updated",
      newStore,
    });
  } catch (error) {
    console.log("[STORE_PATCH]", error);
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

    if (existingStore.userId !== user.id) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    await db.store.delete({
      where: {
        id: existingStore.id,
      },
      select: {
        id: true,
      },
    });
    return NextResponse.json({
      success: "Store deleted.",
    });
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
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
    console.log("[GET STORE]", error);
    return new NextResponse("Internal Eror", { status: 500 });
  }
}

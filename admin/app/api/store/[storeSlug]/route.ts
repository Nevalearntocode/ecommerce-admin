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
        userId_slug: {
          userId: user.id,
          slug: params.storeSlug,
        },
      },
      select: {
        id: true,
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const existedStoreWithGivenName = await db.store.findUnique({
      where: {
        userId_name: {
          userId: user.id,
          name,
        },
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
        userId_slug: {
          userId: user.id,
          slug,
        },
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

    const store = await db.store.delete({
      where: {
        userId_slug: {
          userId: user.id,
          slug: params.storeSlug,
        },
      },
      select: {
        id: true,
      },
    });

    if (!store) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    return NextResponse.json({
      success: "Store deleted.",
    });
  } catch (error) {
    console.log("[LISTING_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import getCurrentUser from "@/lib/get-current-user";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { StoreType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    const {
      name,
      type,
      slug,
    }: { name: string; type: StoreType; slug: string } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Store name is required.", { status: 400 });
    }

    if (!type) {
      return new NextResponse("Store type is required.", { status: 400 });
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

    if (existedStoreWithGivenName) {
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

    if (existedStoreWithGivenSlug) {
      return new NextResponse(`Store with slug: ${slug} already exists`, {
        status: 400,
      });
    }
    const defaultSlug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const newStore = await db.store.create({
      data: {
        name,
        slug: slug === "" ? defaultSlug : slug,
        type,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: "Store created",
      newStore,
    });
  } catch (error) {
    console.log("[routeName]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

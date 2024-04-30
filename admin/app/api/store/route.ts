import getCurrentUser from "@/data/get-current-user";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { StoreType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    const {
      name,
      type,
      image,
      slug,
    }: { name: string; type: StoreType; slug: string; image: string } =
      await req.json();

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
        name,
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
        slug,
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
        image,
        storeType: type,
        userId: user.id,
        staffs: {
          create: {
            userId: user.id,
            isAdmin: true,
            canManageStore: true,
            canManageBillboard: true,
            canManageCategory: true,
            canManageProduct: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: "Store created",
      newStore,
    });
  } catch (error) {
    new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const stores = await db.store.findMany({
      include: {
        categories: {
          include: {
            billboard: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(stores);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { getStoreWithCurrentStaff } from "@/lib/get-stores";
import { canManageProduct } from "@/lib/permission-hierarchy";

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
      return new NextResponse("Model value is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (existingStore.storeType !== "TECHNOLOGY") {
      return new NextResponse(
        "Model is not a valid attribute for this product. Please use relevant attributes.",
        { status: 400 },
      );
    }

    const staff = existingStore.staffs[0];

    if (!staff || !canManageProduct(staff)) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    const newModel = await db.model.create({
      data: {
        name,
        value,
        storeId: existingStore.id,
      },
    });

    return NextResponse.json({ success: "Model created.", newModel });
  } catch (error) {
    console.log("[POST MODEL]", error);
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
        models: {
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
        "Model is not a valid attribute for this product. Please use relevant attributes.",
        { status: 400 },
      );
    }

    return NextResponse.json({
      models: existingStore.models,
    });
  } catch (error) {
    console.log("[POST MODEL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
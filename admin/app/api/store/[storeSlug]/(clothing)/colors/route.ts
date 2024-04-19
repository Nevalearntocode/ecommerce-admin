import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { getStoreWithCurrentStaff } from "@/lib/get-stores";
import { canManageProduct } from "@/lib/permission-hierarchy";
import { expandHexCode } from "@/lib/convert-hex-code";

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
      return new NextResponse("Color value is required.", { status: 400 });
    }

    const updateData = {
      value: "",
    };

    if (value.length === 4) {
      updateData.value = expandHexCode(value);
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (existingStore.storeType !== "CLOTHING") {
      return new NextResponse(
        "Color is not a valid attribute for this product. Please use relevant attributes.",
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

    const newColor = await db.color.create({
      data: {
        name,
        value: updateData.value,
        storeId: existingStore.id,
      },
    });

    return NextResponse.json({ success: "Color created.", newColor });
  } catch (error) {
    console.log("[POST COLOR]", error);
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
        colors: {
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
        "Color is not a valid attribute for this product. Please use relevant attributes.",
        { status: 400 },
      );
    }

    return NextResponse.json({
      colors: existingStore.colors,
    });
  } catch (error) {
    console.log("[POST COLOR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
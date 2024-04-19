import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { SizeValue } from "@prisma/client";
import { getStoreWithCurrentStaff } from "@/lib/get-stores";
import { canManageProduct } from "@/lib/permission-hierarchy";

export async function POST(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    const { name, value }: { name: string; value: SizeValue } =
      await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required.", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Size value is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(
      params.storeSlug,
      user.id,
    );

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (existingStore.storeType === "TECHNOLOGY") {
      return new NextResponse(
        "Size is not a valid attribute for technology products. Please use relevant attributes like model or type.",
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

    const newSize = await db.size.create({
      data: {
        name,
        value,
        storeId: existingStore.id,
      },
    });

    return NextResponse.json({ success: "Size created.", newSize });
  } catch (error) {
    console.log("[POST SIZE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

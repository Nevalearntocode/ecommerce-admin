import { NextResponse } from "next/server";
import getCurrentUser from "@/lib/get-current-user";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string; staffId: number } },
) {
  try {
    const user = await getCurrentUser();

    const {
      isAdmin,
      canManageStore,
      canManageCategory,
      canManageBillboard,
      canManageProduct,
      canDeleteCategory,

    }: {
      isAdmin?: boolean;
      canManageStore?: boolean;
      canManageCategory?: boolean;
      canManageBillboard?: boolean;
      canManageProduct?: boolean;
      canDeleteCategory?: boolean;
    } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!params.staffId) {
      return new NextResponse("Staff id is required.", { status: 400 });
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

    if (isAdmin && existingStore.userId !== user.id) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    const staff = existingStore.staffs[0];

    if (!staff.isAdmin && existingStore.userId !== user.id) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    const updateData = {
      isAdmin: isAdmin ?? staff.isAdmin,
      canManageStore: canManageStore ?? staff.canManageStore,
      canManageCategory: canManageCategory ?? staff.canManageCategory,
      canManageBillboard: canManageBillboard ?? staff.canManageBillboard,
      canManageProduct: canManageProduct ?? staff.canManageProduct,
      canDeleteCategory: canDeleteCategory ?? staff.canDeleteCategory,
    };

    const updateStaff = await db.staff.update({
      where: {
        id: Number(params.staffId),
        store: {
          slug: params.storeSlug,
        },
      },
      data: { ...updateData },
    });

    return NextResponse.json({ success: "User roles updated", updateStaff });
  } catch (error) {
    console.log("[STAFF ROLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

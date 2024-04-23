import { NextResponse } from "next/server";
import getCurrentUser from "@/lib/get-current-user";
import { db } from "@/lib/db";
import { canManageStaff, isOwner } from "@/lib/permission-hierarchy";

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
    }: {
      isAdmin?: boolean;
      canManageStore?: boolean;
      canManageCategory?: boolean;
      canManageBillboard?: boolean;
      canManageProduct?: boolean;
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

    const existingStaff = await db.staff.findUnique({
      where: {
        id: Number(params.staffId),
      },
    });

    if (!existingStaff) {
      return new NextResponse("Staff not found.", { status: 404 });
    }

    if (
      (!existingStore.staffs[0] || !canManageStaff(existingStore.staffs[0])) &&
      !isOwner(user.id, existingStore.userId)
    ) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    const updateData = {
      isAdmin: isAdmin ?? existingStaff.isAdmin,
      canManageStore: canManageStore ?? existingStaff.canManageStore,
      canManageCategory: canManageCategory ?? existingStaff.canManageCategory,
      canManageBillboard:
        canManageBillboard ?? existingStaff.canManageBillboard,
      canManageProduct: canManageProduct ?? existingStaff.canManageProduct,
    };

    const updateStaff = await db.staff.update({
      where: {
        id: existingStaff.id,
        store: {
          slug: params.storeSlug,
        },
      },
      data: { ...updateData },
    });

    return NextResponse.json({ success: "Staff roles updated", updateStaff });
  } catch (error) {
    console.log("[STAFF ROLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

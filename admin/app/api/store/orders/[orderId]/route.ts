import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import next from "next";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.orderId || isNaN(Number(params.orderId))) {
      return new NextResponse(
        "Order ID does not exist or can not be converted to number.",
        { status: 400 },
      );
    }

    const order = await db.order.findUnique({
      where: {
        id: Number(params.orderId),
      },
      include: {
        orderItems: true,
        store: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    if (order.isPaid === true) {
      return new NextResponse("Order is already paid", { status: 400 });
    }

    const currentStaff = await db.staff.findUnique({
      where: {
        userId_storeId: {
          userId: user.id,
          storeId: order.storeId,
        },
      },
    });

    if (
      (!currentStaff || !canManageProduct(currentStaff)) &&
      !isOwner(user.id, order.store.userId)
    ) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    await prisma.$transaction(async (tx) => {
      for (const orderItem of order.orderItems) {
        const product = await tx.product.findUnique({
          where: { id: orderItem.productId },
        });

        if (!product) {
          throw new Error("Product not found");
        }

        if (product.stock < orderItem.quantity) {
          throw new Error("Product out of stock");
        }

        await tx.product.update({
          where: { id: orderItem.productId },
          data: { stock: { decrement: orderItem.quantity } },
        });
      }

      await tx.order.update({
        where: { id: Number(params.orderId) },
        data: { isPaid: true },
      });
    });

    const updatedOrder = await db.order.update({
      where: {
        id: Number(params.orderId),
      },
      data: {
        isPaid: true,
      },
    });

    return NextResponse.json({
      success: "Order has been paid.",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.log("[ORDER PATCH]", error);
    return new NextResponse(error.message, { status: 500 });
  }
}

// write a DELETE request to cancel an order
export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.orderId || isNaN(Number(params.orderId))) {
      return new NextResponse(
        "Order ID does not exist or can not be converted to number.",
        { status: 400 },
      );
    }

    const order = await db.order.findUnique({
      where: {
        id: Number(params.orderId),
      },
      include: {
        store: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    if (order.isPaid === true) {
      return new NextResponse("Order is already paid", { status: 400 });
    }

    const currentStaff = await db.staff.findUnique({
      where: {
        userId_storeId: {
          userId: user.id,
          storeId: order.storeId,
        },
      },
    });

    if (
      (!currentStaff || !canManageProduct(currentStaff)) &&
      !isOwner(user.id, order.store.userId)
    ) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    await db.order.delete({
      where: {
        id: Number(params.orderId),
      },
    });

    return NextResponse.json({
      success: "Order has been canceled.",
    });
  } catch (error) {
    console.log("[ORDER DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

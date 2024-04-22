import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { getModelById } from "@/lib/get-models";
import { getStoreWithCurrentStaff } from "@/lib/get-stores";
import { canManageProduct, isOwner } from "@/lib/permission-hierarchy";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string; modelId: string } },
) {
  try {
    const user = await getCurrentUser();

    const { value, name }: { value?: string; name?: string } =
      await req.json();

    const { storeSlug, modelId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!modelId) {
      return new NextResponse("Model id is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (
      (!existingStore.staffs[0] ||
        !canManageProduct(existingStore.staffs[0])) &&
      !isOwner(existingStore.staffs[0], existingStore.userId)
    ) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    const existingModel = await getModelById(modelId);

    if (!existingModel) {
      return new NextResponse("Model not found.", { status: 404 });
    }

    const updateData = {
      name: name ? name : existingModel.name,
      value: value ? value : existingModel.value,
    };

    if (
      updateData.name == existingModel.name &&
      updateData.value == existingModel.value
    ) {
      return new NextResponse("Model has not changed.", { status: 200 });
    }

    const newModel = await db.model.update({
      where: {
        id: existingModel.id,
      },
      data: { ...updateData },
    });

    return NextResponse.json({
      success: "Model updated.",
      model: newModel,
    });
  } catch (error) {
    console.log("[MODEL PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeSlug: string; modelId: string } },
) {
  try {
    const user = await getCurrentUser();
    const { storeSlug, modelId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!modelId) {
      return new NextResponse("Model id is required.", { status: 400 });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }
    if (
      (!existingStore.staffs[0] ||
        !canManageProduct(existingStore.staffs[0])) &&
      !isOwner(existingStore.staffs[0], existingStore.userId)
    ) {
      return new NextResponse(
        "You do not have permission to perform this action.",
        { status: 403 },
      );
    }

    const existingModel = await getModelById(modelId);

    if (!existingModel) {
      return new NextResponse("Model not found.", { status: 404 });
    }

    await db.model.delete({
      where: {
        id: existingModel.id,
      },
    });

    return NextResponse.json({
      success: "Model deleted.",
    });
  } catch (error) {
    console.log("[MODEL DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { modelId: string } },
) {
  try {
    if (!params.modelId) {
      return new NextResponse("Model ID is required.", { status: 400 });
    }
    const model = await getModelById(params.modelId);

    if (!model) {
      return new NextResponse("No models found.", { status: 404 });
    }

    return NextResponse.json(model);
  } catch (error) {
    console.log("[GET MODEL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

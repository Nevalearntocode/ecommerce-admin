import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import {
  getStoreToCreateProduct,
  getTechnologyAttributeIds,
} from "@/lib/get-stores";
import { canManageProduct, isOwner } from "@/lib/permission-hierarchy";
import { getSizeIdByNameAndStoreId } from "@/lib/get-sizes";
import { getColorIdByNameAndStoreId } from "@/lib/get-colors";
import { getModelIdByNameAndStoreId } from "@/lib/get-models";
import { getTypeIdByNameAndStoreId } from "@/lib/get-types";

export async function POST(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { storeSlug } = params;

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    const {
      name,
      description,
      price,
      stock,
      images,
      brand,
      isFeatured,
      categoryName,
      sizeName,
      colorName,
      typeName,
      modelName,
    }: {
      name?: string;
      price?: string;
      stock?: string;
      isFeatured?: boolean;
      categoryName?: string;
      images: string[];
      brand?: string;
      description?: string;
      sizeName?: string;
      colorName?: string;
      typeName?: string;
      modelName?: string;
    } = await req.json();

    if (!name) {
      return new NextResponse("Product name is required.", { status: 400 });
    }

    if (!price || isNaN(parseFloat(price))) {
      return new NextResponse(
        "Product price is required and must be a number.",
        { status: 400 },
      );
    }

    if (!stock || isNaN(parseInt(stock, 10))) {
      return new NextResponse(
        "Product stock is required and must be a number.",
        { status: 400 },
      );
    }

    if (!categoryName) {
      return new NextResponse("Product category is required.", {
        status: 400,
      });
    }

    if (images.length === 0) {
      return new NextResponse("At least one product image is required.", {
        status: 400,
      });
    } else if (images.length > 3) {
      return new NextResponse("At most three product images can be uploaded.", {
        status: 400,
      });
    }

    const existingStore = await getStoreToCreateProduct(
      storeSlug,
      user.id,
      name,
      categoryName,
    );

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (existingStore.products[0]) {
      return new NextResponse(
        `There is already a product with name: ${name}.`,
        { status: 409 },
      );
    }

    if (
      (!existingStore.staffs[0] || !canManageProduct(existingStore.staffs[0])) &&
      !isOwner(existingStore.staffs[0], existingStore.userId)
    ) {
      return new NextResponse(
        "You do not have permisson to perform this action.",
      );
    }

    const updateData = {
      name,
      price: parseFloat(price),
      stock: Number(stock),
      slug: name.toLowerCase().trim().replace(/\s+/g, "-"),
      brand,
      isFeatured,
      description,
      categoryId: existingStore.categories[0].id,
      storeId: existingStore.id,
      sizeId: null as number | null,
      colorId: null as number | null,
      modelId: null as number | null,
      typeId: null as number | null,
    };

    if (existingStore.storeType === "CLOTHING") {
      if (sizeName && sizeName !== "") {
        const size = await getSizeIdByNameAndStoreId(
          sizeName,
          existingStore.id,
        );

        if (!size) {
          return new NextResponse(
            "Your store doesn't have the size in your request.",
            { status: 404 },
          );
        }

        updateData.sizeId = size.id;
      }
      if (colorName && colorName !== "") {
        const color = await getColorIdByNameAndStoreId(
          colorName,
          existingStore.id,
        );

        if (!color) {
          return new NextResponse(
            "Your store doesn't have the color in your request.",
            { status: 404 },
          );
        }

        updateData.colorId = color.id;
      }
      const newClothingProduct = await db.product.create({
        data: {
          name: updateData.name,
          price: updateData.price,
          slug: updateData.slug,
          stock: updateData.stock,
          brand: updateData.brand,
          description: updateData.description,
          categoryId: updateData.categoryId,
          storeId: updateData.storeId,
          images: [...images],
          isFeatured: updateData.isFeatured,
          sizeId: updateData.sizeId,
          colorId: updateData.colorId,
        },
      });

      return NextResponse.json({
        success: "Product created.",
        product: newClothingProduct,
      });
    }

    if (existingStore.storeType === "TECHNOLOGY") {
      if (modelName && modelName !== "") {
        const model = await getModelIdByNameAndStoreId(
          modelName,
          existingStore.id,
        );

        if (!model) {
          return new NextResponse(
            "Your store doesn't have the model in your request.",
            { status: 404 },
          );
        }

        updateData.modelId = model.id;
      }
      if (typeName && typeName !== "") {
        const type = await getTypeIdByNameAndStoreId(
          typeName,
          existingStore.id,
        );

        if (!type) {
          return new NextResponse(
            "Your store doesn't have the type in your request.",
            { status: 404 },
          );
        }

        updateData.typeId = type.id;
      }

      const newTechnology = await db.product.create({
        data: {
          name: updateData.name,
          price: updateData.price,
          slug: updateData.slug,
          stock: updateData.stock,
          brand: updateData.brand,
          description: updateData.description,
          categoryId: updateData.categoryId,
          storeId: updateData.storeId,
          images: [...images],
          isFeatured: updateData.isFeatured,
          modelId: updateData.modelId,
          typeId: updateData.typeId,
        },
      });

      return NextResponse.json({
        success: "Product created.",
        product: newTechnology,
      });
    }

    return new NextResponse("Something went wrong.", { status: 500 });
  } catch (error) {
    console.log("[CREATE PRODUCT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

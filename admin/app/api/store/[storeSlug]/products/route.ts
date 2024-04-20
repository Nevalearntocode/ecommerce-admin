import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import {
  getClothingAttributeIds,
  getStoreToCreateProduct,
  getTechnologyAttributeIds,
} from "@/lib/get-stores";
import { canManageProduct } from "@/lib/permission-hierarchy";

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
      !existingStore.staffs[0] ||
      !canManageProduct(existingStore.staffs[0])
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
      sizeId: 0,
      colorId: 0,
      modelId: 0,
      typeId: 0,
    };

    if (existingStore.storeType === "CLOTHING") {
      if (!sizeName) {
        return new NextResponse("Size is required.", { status: 400 });
      }
      if (!colorName) {
        return new NextResponse("Color is required.", { status: 400 });
      }
      const clothingAttributeIds = await getClothingAttributeIds(
        existingStore.id,
        sizeName,
        colorName,
      );

      if (
        !clothingAttributeIds ||
        !clothingAttributeIds.sizes ||
        !clothingAttributeIds.colors
      ) {
        return new NextResponse(
          "Your store doesn't have size or color named in your request.",
          { status: 404 },
        );
      }

      updateData.sizeId = clothingAttributeIds.sizes[0].id;
      updateData.colorId = clothingAttributeIds.colors[0].id;

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
      if (!modelName) {
        return new NextResponse("Model is required.", { status: 400 });
      }
      if (!typeName) {
        return new NextResponse("Type is required.", { status: 400 });
      }
      const technologyAttributeIds = await getTechnologyAttributeIds(
        existingStore.id,
        modelName,
        typeName,
      );

      if (
        !technologyAttributeIds ||
        !technologyAttributeIds.models ||
        !technologyAttributeIds.types
      ) {
        return new NextResponse(
          "Your store doesn't have model or type named in your request.",
          { status: 404 },
        );
      }

      updateData.modelId = technologyAttributeIds.models[0].id;
      updateData.typeId = technologyAttributeIds.types[0].id;

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

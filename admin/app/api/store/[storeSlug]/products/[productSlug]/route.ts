import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";
import { getStoreWithCurrentStaff } from "@/lib/get-stores";
import { canManageProduct } from "@/lib/permission-hierarchy";
import {
  getClothingProductWithStoreType,
  getTechnologyProductWithStoreType,
} from "@/lib/get-products";

export async function PATCH(
  req: Request,
  { params }: { params: { storeSlug: string; productSlug: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { storeSlug, productSlug } = params;

    if (!storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    if (!productSlug) {
      return new NextResponse("Product slug is required.", { status: 400 });
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
      images: string[];
      brand?: string;
      description?: string;
      categoryName?: string;
      sizeName?: string;
      colorName?: string;
      typeName?: string;
      modelName?: string;
    } = await req.json();

    if (images.length > 3) {
      return new NextResponse("At most three product images can be uploaded.", {
        status: 400,
      });
    }

    const existingStore = await getStoreWithCurrentStaff(storeSlug, user.id);

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    if (
      !existingStore.staffs[0] ||
      !canManageProduct(existingStore.staffs[0])
    ) {
      return new NextResponse(
        "You do not have permisson to perform this action.",
      );
    }

    if (existingStore.storeType === "CLOTHING") {
      if (modelName || typeName) {
        return new NextResponse(
          "Your products don't have type or model attribute.",
          { status: 400 },
        );
      }

      const existingProduct = await getClothingProductWithStoreType(
        existingStore.id,
        productSlug,
      );

      if (!existingProduct) {
        return new NextResponse("Product not found.", { status: 404 });
      }

      const updateData = {
        name: name ? name : existingProduct.name,
        price: price ? parseFloat(price) : existingProduct.price,
        stock: stock ? Number(stock) : existingProduct.stock,
        slug: name
          ? name.toLowerCase().trim().replace(/\s+/g, "-")
          : existingProduct.slug,
        brand: brand ? brand : existingProduct.brand,
        isFeatured: isFeatured ? isFeatured : existingProduct.isFeatured,
        description: description ? description : existingProduct.description,
        images: images.length > 0 ? images : existingProduct.images,
        categoryId: existingProduct.categoryId,
        sizeId: existingProduct.sizeId,
        colorId: existingProduct.colorId,
      };

      //   Check if category has changed
      if (
        categoryName &&
        categoryName !== "" &&
        categoryName !== existingProduct.category.name
      ) {
        const updateCategory = await db.category.findUnique({
          where: {
            name_storeId: {
              name: categoryName,
              storeId: existingStore.id,
            },
          },
          select: {
            id: true,
          },
        });

        if (!updateCategory) {
          return new NextResponse("No categories with given name found.", {
            status: 404,
          });
        }

        updateData.categoryId = updateCategory.id;
      }

      if (
        sizeName &&
        sizeName !== "" &&
        sizeName !== existingProduct.size?.name
      ) {
        const updateSize = await db.size.findUnique({
          where: {
            name_storeId: {
              name: sizeName,
              storeId: existingStore.id,
            },
          },
          select: {
            id: true,
          },
        });

        if (!updateSize) {
          return new NextResponse("No sizes with given name found.", {
            status: 404,
          });
        }

        updateData.sizeId = updateSize.id;
      }

      if (
        colorName &&
        colorName !== "" &&
        colorName !== existingProduct.color?.name
      ) {
        const updateColor = await db.color.findUnique({
          where: {
            name_storeId: {
              name: colorName,
              storeId: existingStore.id,
            },
          },
          select: {
            id: true,
          },
        });

        if (!updateColor) {
          return new NextResponse("No colors with given name found.", {
            status: 404,
          });
        }

        updateData.colorId = updateColor.id;
      }
      const updatedProduct = await db.product.update({
        where: {
          id: existingProduct.id,
        },
        data: { ...updateData },
      });

      return NextResponse.json({
        success: "Product updated.",
        product: updatedProduct,
      });
    }
    if (existingStore.storeType === "TECHNOLOGY") {
      if (sizeName || colorName) {
        return new NextResponse(
          "Your products don't have color or size attribute.",
          { status: 400 },
        );
      }

      const existingProduct = await getTechnologyProductWithStoreType(
        existingStore.id,
        productSlug,
      );

      if (!existingProduct) {
        return new NextResponse("Product not found.", { status: 404 });
      }

      const updateData = {
        name: name ? name : existingProduct.name,
        price: price ? parseFloat(price) : existingProduct.price,
        stock: stock ? Number(stock) : existingProduct.stock,
        slug: name
          ? name.toLowerCase().trim().replace(/\s+/g, "-")
          : existingProduct.slug,
        brand: brand ? brand : existingProduct.brand,
        isFeatured: isFeatured ? isFeatured : existingProduct.isFeatured,
        description: description ? description : existingProduct.description,
        images: images.length > 0 ? images : existingProduct.images,
        categoryId: existingProduct.categoryId,
        modelId: existingProduct.modelId,
        typeId: existingProduct.typeId,
      };

      //   Check if category has changed
      if (
        categoryName &&
        categoryName !== "" &&
        categoryName !== existingProduct.category.name
      ) {
        const updateCategory = await db.category.findUnique({
          where: {
            name_storeId: {
              name: categoryName,
              storeId: existingStore.id,
            },
          },
          select: {
            id: true,
          },
        });

        if (!updateCategory) {
          return new NextResponse("No categories with given name found.", {
            status: 404,
          });
        }

        updateData.categoryId = updateCategory.id;
      }

      if (
        modelName &&
        modelName !== "" &&
        modelName !== existingProduct.model?.name
      ) {
        const updateModel = await db.model.findUnique({
          where: {
            name_storeId: {
              name: modelName,
              storeId: existingStore.id,
            },
          },
          select: {
            id: true,
          },
        });

        if (!updateModel) {
          return new NextResponse("No models with given name found.", {
            status: 404,
          });
        }

        updateData.modelId = updateModel.id;
      }

      if (
        typeName &&
        typeName !== "" &&
        typeName !== existingProduct.type?.name
      ) {
        const updateType = await db.type.findUnique({
          where: {
            name_storeId: {
              name: typeName,
              storeId: existingStore.id,
            },
          },
          select: {
            id: true,
          },
        });

        if (!updateType) {
          return new NextResponse("No types with given name found.", {
            status: 404,
          });
        }

        updateData.typeId = updateType.id;
      }
      const updatedProduct = await db.product.update({
        where: {
          id: existingProduct.id,
        },
        data: { ...updateData },
      });

      return NextResponse.json({
        success: "Product updated.",
        product: updatedProduct,
      });
    }

    return new NextResponse("Something went wrong.", { status: 500 });
  } catch (error) {
    console.log("[UPDATE PRODUCT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

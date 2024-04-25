import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/data/get-current-user";
import { getStoreToCreateProduct } from "@/data/get-stores";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import { getSizeIdByNameAndStoreId } from "@/data/get-sizes";
import { getColorIdByNameAndStoreId } from "@/data/get-colors";
import { getModelIdByNameAndStoreId } from "@/data/get-models";
import { getTypeIdByNameAndStoreId } from "@/data/get-types";

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
      isArchived,
      categoryName,
      sizeName,
      colorName,
      typeName,
      modelName,
    }: {
      name?: string;
      price?: string;
      stock?: string;
      isArchived?: boolean;
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
      (!existingStore.staffs[0] ||
        !canManageProduct(existingStore.staffs[0])) &&
      !isOwner(user.id, existingStore.userId)
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
      brand: brand?.toLowerCase(),
      isFeatured,
      isArchived,
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
          ...updateData,
          images: [...images],
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
          ...updateData,
          images: [...images],
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

export async function GET(
  req: Request,
  { params }: { params: { storeSlug: string } },
) {
  try {
    if (!params.storeSlug) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    const existingStore = await db.store.findUnique({
      where: {
        slug: params.storeSlug,
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const categorySlug =
      searchParams.get("category")?.toLowerCase() || undefined;
    const brand = searchParams.get("brand")?.toLowerCase() || undefined;
    const colorName = searchParams.get("color")?.toLowerCase() || undefined;
    const sizeName = searchParams.get("size")?.toLowerCase() || undefined;
    const modelName = searchParams.get("model")?.toLowerCase() || undefined;
    const typeName = searchParams.get("type")?.toLowerCase() || undefined;
    const isFeatured = searchParams.get("featured")?.toLowerCase() || undefined;

    const featured = isFeatured === "true";

    if (existingStore.storeType === "CLOTHING") {
      const products = await db.product.findMany({
        where: {
          storeId: existingStore.id,
          category: {
            slug: categorySlug,
          },
          brand,
          isFeatured: featured ? true : undefined,
          isArchived: false,
          color: {
            name: colorName,
          },
          size: {
            name: sizeName,
          },
        },
        include: {
          category: true,
          color: true,
          size: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(products);
    }

    if (existingStore.storeType === "TECHNOLOGY") {
      const products = await db.product.findMany({
        where: {
          storeId: existingStore.id,
          category: {
            slug: categorySlug,
          },
          brand,
          isFeatured: isFeatured ? true : undefined,
          isArchived: false,
          model: {
            name: modelName,
          },
          type: {
            name: typeName,
          },
        },
        include: {
          category: true,
          model: true,
          type: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(products);
    }

    return new NextResponse("Something went wrong", { status: 500 });
  } catch (error) {
    console.log("[GET PRODUCTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

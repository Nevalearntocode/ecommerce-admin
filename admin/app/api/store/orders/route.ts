import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const {
      products,
      storeId,
      name,
      email,
      phone,
      address,
    }: {
      products: {
        productId: string;
        quantity: number;
      }[];
      storeId: string;
      name: string;
      email: string;
      phone: string;
      address: string;
    } = await req.json();

    // Check if products is an array
    if (!Array.isArray(products) || products.length === 0) {
      return new NextResponse("Invalid request. Products must be a non-empty array.", { status: 400 });
    }

    // Check if storeId is a valid number
    if (isNaN(Number(storeId))) {
      return new NextResponse("Invalid request. Store ID must be a valid number.", { status: 400 });
    }

    // Check if name is a non-empty string
    if (typeof name !== "string" || name.trim() === "") {
      return new NextResponse("Invalid request. Name must be a non-empty string.", { status: 400 });
    }

    // Check if email is a valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse("Invalid request. Email must be a valid email address.", { status: 400 });
    }

    // Check if phone is a valid phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return new NextResponse("Invalid request. Phone must be a 10-digit number.", { status: 400 });
    }

    // Check if address is a non-empty string
    if (typeof address !== "string" || address.trim() === "") {
      return new NextResponse("Invalid request. Address must be a non-empty string.", { status: 400 });
    }

    const order = await db.order.create({
      data: {
        storeId: Number(storeId),
        customer: name,
        email,
        phone,
        address,
        orderItems: {
          create: products.map((product) => ({
            product: {
              connect: {
                id: Number(product.productId),
              },
            },
            quantity: product.quantity,
          })),
        },
      },
    });

    return NextResponse.json(
      { success: "Your order has been created.", order },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.log("[POST ORDERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

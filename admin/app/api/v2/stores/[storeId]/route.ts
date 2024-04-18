import { getStoreById } from "@/lib/get-stores";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { storeId } = params;

    if (!storeId) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    const store = await getStoreById(params.storeId);

    if (!store) {
      return new NextResponse("Store not found.", { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error: any) {
    console.log("[GET STORE BY ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

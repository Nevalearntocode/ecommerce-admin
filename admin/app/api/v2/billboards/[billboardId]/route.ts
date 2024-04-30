import { getBillboardById } from "@/data/get-billboards";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } },
) {
  try {
    const { billboardId } = params;

    if (!billboardId) {
      return new NextResponse("Store slug is required.", { status: 400 });
    }

    const billboard = await getBillboardById(params.billboardId);

    if (!billboard) {
      return new NextResponse("Billboard not found.", { status: 404 });
    }

    return NextResponse.json(billboard);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

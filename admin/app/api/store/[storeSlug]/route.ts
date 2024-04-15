import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import getCurrentUser from "@/lib/get-current-user";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    const { name, slug }: { name: string; slug: string } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

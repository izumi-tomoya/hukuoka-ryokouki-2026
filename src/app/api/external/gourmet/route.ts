import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { searchGourmet } from "@/lib/external/hotpepper";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const info = await searchGourmet(name);
  return NextResponse.json(info);
}

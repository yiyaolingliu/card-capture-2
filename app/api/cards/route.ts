import { NextRequest, NextResponse } from "next/server";
import { listSubmittedCards } from "@/lib/jamai";
import { safeErrorMessage } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";
    const column = searchParams.get("column") ?? "all";
    const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
    const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

    const result = await listSubmittedCards({ query, column, limit, offset });
    return NextResponse.json(result);
  } catch (error) {
    console.error("List cards error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 500 });
  }
}

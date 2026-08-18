import { NextRequest, NextResponse } from "next/server";
import { getSubmittedCardImageUrl } from "@/lib/jamai";
import { safeErrorMessage } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ rowId: string }> },
) {
  try {
    const { rowId } = await params;
    if (!rowId) return NextResponse.json({ error: "Missing row ID." }, { status: 400 });

    const imageUrl = await getSubmittedCardImageUrl(rowId);
    if (!imageUrl) {
      return NextResponse.json({ error: "No image found for this card." }, { status: 404 });
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Get image error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 500 });
  }
}

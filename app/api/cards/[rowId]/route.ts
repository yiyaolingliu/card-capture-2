import { NextRequest, NextResponse } from "next/server";
import { getSubmittedCard, updateSubmittedCard, deleteSubmittedCard } from "@/lib/jamai";
import { safeErrorMessage } from "@/lib/errors";
import type { UpdateSubmittedCardRequest } from "@/types/card";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ rowId: string }> },
) {
  try {
    const { rowId } = await params;
    if (!rowId) return NextResponse.json({ error: "Missing row ID." }, { status: 400 });
    const card = await getSubmittedCard(rowId);
    return NextResponse.json(card);
  } catch (error) {
    console.error("Get card error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ rowId: string }> },
) {
  try {
    const { rowId } = await params;
    if (!rowId) return NextResponse.json({ error: "Missing row ID." }, { status: 400 });

    const body: UpdateSubmittedCardRequest = await request.json();
    const updated = await updateSubmittedCard(rowId, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update card error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ rowId: string }> },
) {
  try {
    const { rowId } = await params;
    if (!rowId) return NextResponse.json({ error: "Missing row ID." }, { status: 400 });
    await deleteSubmittedCard(rowId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete card error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 500 });
  }
}

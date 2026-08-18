import { NextRequest, NextResponse } from "next/server";
import { getJamAIClient } from "@/lib/jamai";
import { JAMAI_COLUMNS } from "@/lib/constants";
import { safeErrorMessage } from "@/lib/errors";
import type { SubmitReviewedCardRequest } from "@/types/card";

export async function POST(request: NextRequest) {
  try {
    const body: SubmitReviewedCardRequest = await request.json();
    const { rowId, fields } = body;

    if (!rowId) {
      return NextResponse.json({ error: "Missing row ID." }, { status: 400 });
    }

    const jamai = getJamAIClient();
    const tableType = (process.env.JAMAI_TABLE_TYPE ?? "action") as "action" | "knowledge" | "chat";
    const tableId = process.env.JAMAI_TABLE_ID!;

    // updateRows expects data as Record<rowId, Record<columnName, value>>
    await jamai.table.updateRows({
      table_type: tableType,
      table_id: tableId,
      data: {
        [rowId]: {
          [JAMAI_COLUMNS.name]: fields.name,
          [JAMAI_COLUMNS.title]: fields.title,
          [JAMAI_COLUMNS.phoneNumber]: fields.phoneNumber,
          [JAMAI_COLUMNS.email]: fields.email,
          [JAMAI_COLUMNS.companyRegion]: fields.companyRegion,
          [JAMAI_COLUMNS.companyName]: fields.companyName,
          [JAMAI_COLUMNS.companyAddress]: fields.companyAddress,
          [JAMAI_COLUMNS.companyWebsite]: fields.companyWebsite,
          [JAMAI_COLUMNS.companyCountry]: fields.companyCountry,
          [JAMAI_COLUMNS.summaryFromWeb]: fields.summaryFromWeb,
        },
      },
    });

    return NextResponse.json({ success: true, rowId });
  } catch (error) {
    console.error("Submit error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: safeErrorMessage(error) },
      { status: 500 }
    );
  }
}

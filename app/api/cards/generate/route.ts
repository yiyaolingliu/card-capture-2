import { NextRequest, NextResponse } from "next/server";
import { getJamAIClient } from "@/lib/jamai";
import { JAMAI_COLUMNS, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";
import { safeErrorMessage } from "@/lib/errors";
import type { GeneratedCardFields, GenerateCardResponse } from "@/types/card";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(request: NextRequest) {
  let tmpFilePath: string | null = null;

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const milestoneMoments = formData.get("milestoneMoments") as string | null;
    const remark = (formData.get("remark") as string) ?? "";

    if (!imageFile) {
      return NextResponse.json(
        { error: "Please upload an image." },
        { status: 400 }
      );
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Please upload a JPG, PNG, or WEBP image." },
        { status: 400 }
      );
    }

    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "This image is too large. Please upload an image under 10 MB." },
        { status: 400 }
      );
    }

    const jamai = getJamAIClient();

    // Write image to a temp file for the SDK upload
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = imageFile.name.split(".").pop() || "jpg";
    tmpFilePath = path.join(os.tmpdir(), `card-upload-${Date.now()}.${ext}`);
    fs.writeFileSync(tmpFilePath, buffer);

    // Upload file to JamAI Base to get a URI
    const uploadResult = await jamai.file.uploadFile({
      file_path: tmpFilePath,
    });
    const imageUri = uploadResult.uri;

    const tableType = (process.env.JAMAI_TABLE_TYPE ?? "action") as "action" | "knowledge" | "chat";
    const tableId = process.env.JAMAI_TABLE_ID!;

    const result = await jamai.table.addRow({
      table_type: tableType,
      table_id: tableId,
      data: [
        {
          [JAMAI_COLUMNS.image]: imageUri,
          [JAMAI_COLUMNS.milestoneMoments]: (milestoneMoments ?? "").trim(),
          [JAMAI_COLUMNS.remark]: (remark ?? "").trim(),
        },
      ],
    });

    // Extract generated fields from the response
    const row = result.rows?.[0];
    const columns = row?.columns ?? {};

    // Helper to extract text content from a column completion
    const getColumnText = (colName: string): string => {
      const col = columns[colName];
      if (!col) return "";
      const choices = col.choices;
      if (choices && choices.length > 0) {
        const choice = choices[0];
        const msg = "message" in choice ? choice.message : ("delta" in choice ? choice.delta : null);
        if (msg?.content && typeof msg.content === "string") return msg.content;
      }
      return "";
    };

    const fields: GeneratedCardFields = {
      name: getColumnText(JAMAI_COLUMNS.name),
      title: getColumnText(JAMAI_COLUMNS.title),
      phoneNumber: getColumnText(JAMAI_COLUMNS.phoneNumber),
      email: getColumnText(JAMAI_COLUMNS.email),
      companyRegion: getColumnText(JAMAI_COLUMNS.companyRegion),
      companyName: getColumnText(JAMAI_COLUMNS.companyName),
      companyAddress: getColumnText(JAMAI_COLUMNS.companyAddress),
      companyWebsite: getColumnText(JAMAI_COLUMNS.companyWebsite),
      companyCountry: getColumnText(JAMAI_COLUMNS.companyCountry),
      summaryFromWeb: getColumnText(JAMAI_COLUMNS.summaryFromWeb),
    };

    // Try to get the row ID from the response
    const rowId = row?.columns?.ID?.id ?? "";

    const response: GenerateCardResponse = { rowId, fields };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Generate error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: safeErrorMessage(error) },
      { status: 500 }
    );
  } finally {
    // Clean up temp file
    if (tmpFilePath) {
      try { fs.unlinkSync(tmpFilePath); } catch { /* ignore */ }
    }
  }
}

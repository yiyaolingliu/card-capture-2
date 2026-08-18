import JamAI from "jamaibase";
import { JAMAI_COLUMNS } from "./constants";
import type { SubmittedCardSummary, CardListResponse, UpdateSubmittedCardRequest } from "@/types/card";

export function getJamAIClient(): JamAI {
  return new JamAI({
    token: process.env.JAMAI_API_KEY!,
    projectId: process.env.JAMAI_PROJECT_ID!,
    baseURL: process.env.JAMAI_BASE_URL || "https://api.jamaibase.com",
    maxRetries: 3,
    timeout: 120_000,
  });
}

export async function resolveFileUrl(uri: string): Promise<string | null> {
  if (!uri || !uri.startsWith("s3://")) {
    // Already a public URL or empty
    return uri || null;
  }
  const baseURL = process.env.JAMAI_BASE_URL || "https://api.jamaibase.com";
  const res = await fetch(`${baseURL}/api/v2/files/url/raw`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.JAMAI_API_KEY!}`,
      "X-PROJECT-ID": process.env.JAMAI_PROJECT_ID!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris: [uri] }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.urls?.[0] ?? null;
}

function getTableConfig() {
  return {
    tableType: (process.env.JAMAI_TABLE_TYPE ?? "action") as "action" | "knowledge" | "chat",
    tableId: process.env.JAMAI_TABLE_ID!,
  };
}

function extractValue(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && "value" in (val as Record<string, unknown>)) {
    return String((val as Record<string, unknown>).value ?? "");
  }
  return String(val);
}

function rowToSummary(row: Record<string, unknown>): SubmittedCardSummary {
  const str = (key: string) => extractValue(row[key]);
  const imageVal = extractValue(row[JAMAI_COLUMNS.image]);
  return {
    rowId: str("ID"),
    name: str(JAMAI_COLUMNS.name),
    title: str(JAMAI_COLUMNS.title),
    phoneNumber: str(JAMAI_COLUMNS.phoneNumber),
    email: str(JAMAI_COLUMNS.email),
    companyRegion: str(JAMAI_COLUMNS.companyRegion),
    companyName: str(JAMAI_COLUMNS.companyName),
    companyAddress: str(JAMAI_COLUMNS.companyAddress),
    companyWebsite: str(JAMAI_COLUMNS.companyWebsite),
    companyCountry: str(JAMAI_COLUMNS.companyCountry),
    summaryFromWeb: str(JAMAI_COLUMNS.summaryFromWeb),
    milestoneMoments: str(JAMAI_COLUMNS.milestoneMoments),
    remark: str(JAMAI_COLUMNS.remark),
    hasImage: imageVal.length > 0,
    updatedAt: str("Updated at") || undefined,
  };
}

export async function listSubmittedCards(params: {
  query?: string;
  column?: string;
  limit?: number;
  offset?: number;
}): Promise<CardListResponse> {
  const jamai = getJamAIClient();
  const { tableType, tableId } = getTableConfig();
  const limit = params.limit ?? 50;
  const offset = params.offset ?? 0;

  // Build search params for JamAI listRows
  const searchQuery = params.query?.trim() ?? "";
  const searchColumns = params.column && params.column !== "all"
    ? [JAMAI_COLUMNS[params.column as keyof typeof JAMAI_COLUMNS] ?? params.column]
    : undefined;

  const result = await jamai.table.listRows({
    table_type: tableType,
    table_id: tableId,
    offset,
    limit,
    order_by: "Updated at",
    order_ascending: false,
    search_query: searchQuery,
    search_columns: searchColumns ?? undefined,
  });

  const rows = (result.items ?? []).map((item: Record<string, unknown>) => rowToSummary(item));
  return { rows, total: result.total ?? 0, offset, limit };
}

export async function getSubmittedCard(rowId: string): Promise<SubmittedCardSummary> {
  const jamai = getJamAIClient();
  const { tableType, tableId } = getTableConfig();

  const row = await jamai.table.getRow({
    table_type: tableType,
    table_id: tableId,
    row_id: rowId,
  });

  return rowToSummary(row as Record<string, unknown>);
}

export async function getSubmittedCardImageUrl(rowId: string): Promise<string | null> {
  const jamai = getJamAIClient();
  const { tableType, tableId } = getTableConfig();

  const row = await jamai.table.getRow({
    table_type: tableType,
    table_id: tableId,
    row_id: rowId,
  });

  const imageVal = extractValue((row as Record<string, unknown>)[JAMAI_COLUMNS.image]);
  if (!imageVal) return null;

  // Convert s3:// URI to a signed public URL
  return resolveFileUrl(imageVal);
}

export async function deleteSubmittedCard(rowId: string): Promise<void> {
  const jamai = getJamAIClient();
  const { tableType, tableId } = getTableConfig();

  await jamai.table.deleteRows({
    table_type: tableType,
    table_id: tableId,
    row_ids: [rowId],
  });
}

export async function updateSubmittedCard(
  rowId: string,
  values: UpdateSubmittedCardRequest,
): Promise<SubmittedCardSummary> {
  const jamai = getJamAIClient();
  const { tableType, tableId } = getTableConfig();

  await jamai.table.updateRows({
    table_type: tableType,
    table_id: tableId,
    data: {
      [rowId]: {
        [JAMAI_COLUMNS.milestoneMoments]: values.milestoneMoments,
        [JAMAI_COLUMNS.remark]: values.remark,
        [JAMAI_COLUMNS.name]: values.name,
        [JAMAI_COLUMNS.title]: values.title,
        [JAMAI_COLUMNS.phoneNumber]: values.phoneNumber,
        [JAMAI_COLUMNS.email]: values.email,
        [JAMAI_COLUMNS.companyRegion]: values.companyRegion,
        [JAMAI_COLUMNS.companyName]: values.companyName,
        [JAMAI_COLUMNS.companyAddress]: values.companyAddress,
        [JAMAI_COLUMNS.companyWebsite]: values.companyWebsite,
        [JAMAI_COLUMNS.companyCountry]: values.companyCountry,
        [JAMAI_COLUMNS.summaryFromWeb]: values.summaryFromWeb,
      },
    },
  });

  return getSubmittedCard(rowId);
}

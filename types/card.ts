export type GeneratedCardFields = {
  name: string;
  title: string;
  phoneNumber: string;
  email: string;
  companyRegion: string;
  companyName: string;
  companyAddress: string;
  companyWebsite: string;
  companyCountry: string;
  summaryFromWeb: string;
};

export type GenerateCardResponse = {
  rowId: string;
  fields: GeneratedCardFields;
  imageUrl?: string;
};

export type SubmitReviewedCardRequest = {
  rowId: string;
  milestoneMoments: string;
  remark: string;
  fields: GeneratedCardFields;
};

export type SubmitReviewedCardResponse = {
  success: boolean;
  rowId: string;
};

export type AppStep = "upload" | "reviewing" | "success";

// Previous submissions types

export type CardColumnKey =
  | "all"
  | "name"
  | "title"
  | "phoneNumber"
  | "email"
  | "companyRegion"
  | "companyName"
  | "companyAddress"
  | "companyWebsite"
  | "companyCountry"
  | "summaryFromWeb"
  | "milestoneMoments"
  | "remark";

export type SubmittedCardSummary = {
  rowId: string;
  name: string;
  title: string;
  phoneNumber: string;
  email: string;
  companyRegion: string;
  companyName: string;
  companyAddress: string;
  companyWebsite: string;
  companyCountry: string;
  summaryFromWeb: string;
  milestoneMoments: string;
  remark: string;
  hasImage: boolean;
  updatedAt?: string;
};

export type UpdateSubmittedCardRequest = {
  milestoneMoments: string;
  remark: string;
  name: string;
  title: string;
  phoneNumber: string;
  email: string;
  companyRegion: string;
  companyName: string;
  companyAddress: string;
  companyWebsite: string;
  companyCountry: string;
  summaryFromWeb: string;
};

export type CardListResponse = {
  rows: SubmittedCardSummary[];
  total: number;
  offset: number;
  limit: number;
};

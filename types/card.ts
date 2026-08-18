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

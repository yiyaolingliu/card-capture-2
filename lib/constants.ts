export const COLOURS = {
  beige: "#F3E2BF",
  cream: "#FDF0D5",
} as const;

export const JAMAI_COLUMNS = {
  image: "Image",
  milestoneMoments: "Milestone Moments",
  remark: "Remark",
  name: "Name",
  title: "Title",
  phoneNumber: "Phone Number",
  email: "Email",
  companyRegion: "Company Region",
  companyName: "Company Name",
  companyAddress: "CompanyAddress",
  companyWebsite: "Company Website",
  companyCountry: "Company Country",
  summaryFromWeb: "Summary from Web",
} as const;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp";
export const MAX_IMAGE_SIZE_MB = Number(process.env.MAX_IMAGE_SIZE_MB ?? 10);
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const GENERATED_FIELD_LABELS: Record<string, string> = {
  name: "Name",
  title: "Title",
  phoneNumber: "Phone Number",
  email: "Email",
  companyRegion: "Company Region",
  companyName: "Company Name",
  companyAddress: "Company Address",
  companyWebsite: "Company Website",
  companyCountry: "Company Country",
  summaryFromWeb: "Summary from Web",
};

export const TEXTAREA_FIELDS = new Set([
  "companyAddress",
  "summaryFromWeb",
]);

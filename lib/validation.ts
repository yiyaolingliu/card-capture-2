import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from "./constants";

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please upload a JPG, PNG, or WEBP image.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `This image is too large. Please upload an image under ${MAX_IMAGE_SIZE_MB} MB.`;
  }
  return null;
}

export function validateUploadForm(image: File | null): string | null {
  if (!image) return "Please upload an image.";
  return validateImageFile(image);
}

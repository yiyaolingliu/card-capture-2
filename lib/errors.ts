export function safeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("timeout")) {
      return "The request timed out. Please try again.";
    }
    if (error.message.includes("401") || error.message.includes("403")) {
      return "Authentication error. Please check API credentials.";
    }
  }
  return "Something went wrong. Please try again.";
}

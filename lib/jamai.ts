import JamAI from "jamaibase";

export function getJamAIClient(): JamAI {
  return new JamAI({
    token: process.env.JAMAI_API_KEY!,
    projectId: process.env.JAMAI_PROJECT_ID!,
    baseURL: process.env.JAMAI_BASE_URL || "https://api.jamaibase.com",
    maxRetries: 3,
    timeout: 120_000,
  });
}

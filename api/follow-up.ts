import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MODEL, getHeaders } from "../lib/model-info";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const trimmed: string = req.body.trimmedText;
  const previousResponseId: string = req.body.previousResponseId;

  if (!trimmed || !previousResponseId) {
    return res.status(400).json({ error: "Missing required fields: trimmedText and previousResponseId" });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      model: MODEL,
      previous_response_id: previousResponseId,
      input: trimmed
    })
  });

  const data = await response.json();
  return { id: data.id, text: data.output[0].content[0].text };
}
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { openai, MODEL } from "../lib/model-info";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const resumeText: string | undefined = req.body?.resumeText;

  const instructions = resumeText
    ? `You are a career coach helping a candidate with job applications. The candidate's resume is below — use it as context for all responses.\n\nRESUME:\n${resumeText.slice(0, 3000)}`
    : "You are a career coach helping a candidate with job applications.";

  const data = await openai.responses.create({
    model: MODEL,
    instructions,
    input: "I've shared my resume. I'm ready to discuss job applications.",
  });

  const output = data.output[0];
  const content = output.type === "message" ? output.content[0] : null;
  const text = content?.type === "output_text" ? content.text : "";
  return res.status(200).json({ id: data.id, text });
}

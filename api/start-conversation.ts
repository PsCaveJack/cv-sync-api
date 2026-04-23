import type { VercelRequest, VercelResponse } from "@vercel/node";

const MODEL = "gpt-4o";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const resumeText: string | undefined = req.body?.resumeText;

  const instructions = resumeText
    ? `You are a career coach helping a candidate with job applications. The candidate's resume is below — use it as context for all responses.\n\nRESUME:\n${resumeText.slice(0, 3000)}`
    : "You are a career coach helping a candidate with job applications.";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      model: MODEL,
      instructions,
      input: "I've shared my resume. I'm ready to discuss job applications.",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    return res.status(response.status).json({ error });
  }

  const data = await response.json();
  return res.status(200).json({ id: data.id, text: data.output[0].content[0].text });
}

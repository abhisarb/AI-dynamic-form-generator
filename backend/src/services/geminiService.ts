import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/config";

const client = new GoogleGenerativeAI(config.geminiApiKey);

// Generate embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = client.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// Generate form schema
export async function generateFormSchema(prompt: string, context: any[]) {
  const model = client.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = `
You are an intelligent form schema generator.

Relevant form history:
${JSON.stringify(context, null, 2)}

Generate a JSON schema for this request:
"${prompt}"
  `;

  const result = await model.generateContent(systemPrompt);

  const text = result.response.text();

  return JSON.parse(text);
}

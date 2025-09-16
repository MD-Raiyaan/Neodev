import { getSystemPrompt } from "@/utils/prompt";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const token = process.env.API_KEY;
const endpoint = process.env.ENDPOINT;

export async function POST(request) {
  try {
        const body = await request.json();
        const messages = body.messages;

        const client = new OpenAI({ baseURL: endpoint, apiKey: token });
        const response = await client.chat.completions.create({
          model: "gemini-2.0-flash",
          messages: [
            {
              role: "system",
              content: getSystemPrompt(),
            },
            ...messages,
          ],
        });

        return NextResponse.json({ message: response.choices[0].message.content });
  } catch (error) {
        return NextResponse.json({error:error.message});
  }
}

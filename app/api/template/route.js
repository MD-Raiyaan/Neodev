import { NextResponse } from "next/server";
import OpenAI from "openai";
import { BASE_PROMPT } from "@/utils/prompt";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";

const token = process.env.API_KEY;
const endpoint = process.env.ENDPOINT;

export async function POST(request) {
  try {
        const body =await request.json();
        const prompt = body.prompt;

        const client = new OpenAI({ baseURL: endpoint, apiKey: token });
        const response = await client.chat.completions.create({
          model: "gemini-2.0-flash",
          messages: [
            {
              role: "system",
              content:
                "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_completion_tokens: 100,
        });

        const answer = response.choices[0].message.content || "";
        console.log("answer : ",answer)

        if (answer.trim() == "react") {
        return NextResponse.json({
            prompts: [
            BASE_PROMPT,
            `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [reactBasePrompt],
        });
        }

        if (answer.trim() === "node") {
        return NextResponse.json({
            prompts: [
            `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [nodeBasePrompt],
        });
        }

        return NextResponse.json({ message: "You cant access this" });
  } catch (error) {
        return NextResponse.json({ error: error.message });
  }
}

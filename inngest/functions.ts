import { getSandbox } from "@/lib/getSandbox";
import { inngest } from "./client";
import {
  createAgent,
  createNetwork,
  createState,
  createTool,
  gemini,
  Message,
  type Tool,
} from "@inngest/agent-kit";
import { Sandbox } from "e2b";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/lib/prompts";
import z from "zod";
import { getAssistantsLastMessage } from "@/lib/getAssistantsLastMessage";
import prisma from "@/lib/prisma";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const AiCodeAgent = inngest.createFunction(
  { id: "AiCodeAgent" },
  { event: "CodeAgent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("Create Sandbox", async () => {
      const sandbox = await Sandbox.create("neodev-nextjs-test");
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });
        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }
        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    const codeAgent = createAgent<AgentState>({
      name: "Code Assistant",
      description:
        "you are a expert software developer who creates beautiful responsive web applications",
      system: PROMPT,
      model: gemini({
        model: "gemini-2.5-flash",
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffer = { stdout: "", stderr: "" };
              const sandbox = await getSandbox(sandboxId);
              try {
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffer.stdout += data;
                  },
                  onStderr: (data) => {
                    buffer.stderr += data;
                  },
                });
                return result.stdout;
              } catch (error) {
                console.log(
                  `Command ${command} failed \n stdout: ${buffer.stdout} \n stderr: ${buffer.stderr}`
                );
                return `Command ${command} failed \n stdout: ${buffer.stdout} \n stderr: ${buffer.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "creates or updates files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run(
              "create-update files",
              async () => {
                const updatedFiles: { [path: string]: string } =
                  network.state.data?.files || {};
                const sandbox = await getSandbox(sandboxId);
                try {
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                } catch (err) {
                  return `Error : ${err}`;
                }
              }
            );
            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "reads files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("read file", async () => {
              const sandbox = await getSandbox(sandboxId);
              try {
                const content = [];
                for (const filePath of files) {
                  const fileContent = await sandbox.files.read(filePath);
                  content.push({ path: filePath, content: fileContent });
                }
                return content;
              } catch (error) {
                return `Error : ${error}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: ({ result, network }) => {
          const lastMessage = getAssistantsLastMessage(result);
          if (lastMessage?.includes("task_summary") && network) {
            network.state.data.summary = lastMessage;
          }
          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "Agent Network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    let result;

    try {
      result = await network.run(event.data.text, { state });
    } catch (error) {
      return await prisma.message.create({
        data: {
          content: "Somethng went wrong please try again later",
          role: "ASSISTANT",
          type: "ERROR",
          projectId: event.data.projectId,
        },
      });
    }

    const fragementTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: gemini({
        model:"gemini-2.0-flash-lite",
      }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "A response generator",
      system: RESPONSE_PROMPT,
      model: gemini({
        model: "gemini-2.0-flash-lite",
      }),
    });

    const { output: fragmentTitleOutput } = await fragementTitleGenerator.run(
      result.state.data.summary
    );
    const { output: responseOuput } = await responseGenerator.run(
      result.state.data.summary
    );

    const parseResponse = (value: Message[]) => {
      const output = value[0];
      if (output.type !== "text") {
        return "Fragment";
      }
      if (Array.isArray(output.content)) {
        return output.content.map((txt) => txt).join("");
      }
      return output.content;
    };

    const isError =
      !result?.state.data.summary ||
      Object.keys(result?.state.data.files || {}).length == 0;

    const hosturl = await step.run("get Sandbox URL", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    await step.run("save-results", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            content: "Somethng went wrong please try again later",
            role: "ASSISTANT",
            type: "ERROR",
            projectId: event.data.projectId,
          },
        });
      }
      return await prisma.message.create({
        data: {
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          projectId: event.data.projectId,
          fragement: {
            create: {
              sandboxurl: hosturl,
              title: "fragment",
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: hosturl,
      title: parseResponse(fragmentTitleOutput),
      files: result.state.data.files,
      summary: parseResponse(responseOuput),
    };
  }
);

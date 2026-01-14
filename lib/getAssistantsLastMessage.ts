import { AgentResult, TextMessage } from "@inngest/agent-kit";

export function  getAssistantsLastMessage(result:AgentResult) {
     const lastIndex = result.output.findLastIndex((message)=>message.role==='assistant');
     const lastMessage=result.output[lastIndex] as TextMessage | undefined;
     return lastMessage?.content ?
                typeof lastMessage.content === 'string'?
                lastMessage.content:
                lastMessage.content.map(txt=>txt).join("")
            :undefined;
}
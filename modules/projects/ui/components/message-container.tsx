"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageCard from "./message-card";
import MessageForm from "./message-form";
import { useEffect,useRef } from "react";
import { Fragment } from "@/lib/generated/prisma/client";
import MessageLoading from "./message-loader";

interface props {
  projectId: string;
  activeFragment : Fragment | null;
  setActiveFragment: (fragment:Fragment | null)=>void;
}

const MessageContainer = ({ projectId, activeFragment, setActiveFragment }: props) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const lastAssistantMessageRef = useRef<string | null>(null);
    const trpc = useTRPC();
    const { data: messages } = useSuspenseQuery(
      trpc.messages.getMany.queryOptions({ projectId },
        {refetchInterval:5000})
    );

    useEffect(()=>{
      const lastAssistantMessage = messages.findLast((message)=>message.role === "ASSISTANT");
      if (
        lastAssistantMessage?.fragement &&
        lastAssistantMessage.fragement.id !== lastAssistantMessageRef.current
      ) {
        setActiveFragment(lastAssistantMessage.fragement);
        lastAssistantMessageRef.current = lastAssistantMessage.id;
      }
    },[messages,setActiveFragment]);

    useEffect(()=>{
       bottomRef.current?.scrollIntoView();
    },[messages.length]);

   const lastMessage=messages[messages.length-1];
   const isLastMessageUser=lastMessage?.role==="USER";

    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="pt-2 pr-1">
            {messages.map((message) => {
              return (
                <MessageCard
                  key={message.id}
                  content={message.content}
                  role={message.role}
                  fragment={message.fragement}
                  type={message.type}
                  createdAt={message.createdAt}
                  isActive={activeFragment?.id === message.fragement?.id}
                  onFragmentClick={() => setActiveFragment(message.fragement)}
                />
              );
            })}
            {isLastMessageUser && <MessageLoading/> }
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="relative p-3 pt-1">
          <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent-to-background/70 pointer-events-none" />
          <MessageForm projectId={projectId} />
        </div>
      </div>
    );
};

export default MessageContainer;
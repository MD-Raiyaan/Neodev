"use client";

import { Card } from "@/components/ui/card";
import { Fragment } from "@/lib/generated/prisma/client";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import {format} from "date-fns"
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronRight, Code2Icon } from "lucide-react";

interface MessageCardprops{
    content:string
    role:MessageRole
    fragment:Fragment | null
    type:MessageType
    createdAt:Date
    isActive:boolean
    onFragmentClick:(fragment:Fragment | null)=>void
}
interface userCardProps{
    content:string
}
interface assistantCardProps {
  content: string;
  fragment: Fragment | null;
  type: MessageType;
  createdAt: Date;
  isActive: boolean;
  onFragmentClick: (fragment: Fragment | null) => void;
}

interface fragmentCardProps {
  fragment: Fragment | null;
  isActive: boolean;
  onFragmentClick: (fragment: Fragment | null) => void;
}

const UserCard=({content}:userCardProps)=>{
    return (
        <div className="flex justify-end pb-4 pr-2 pl-10">
           <Card 
            className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] wrap-break-word" >
                {content}
           </Card>
        </div>
    )
}

const AssistantCard=({content,type,createdAt,fragment,onFragmentClick,isActive}:assistantCardProps)=>{
    return (
      <div
        className={cn(
          "flex flex-col group px-2 pb-4 ",
          type === "ERROR" && "text-red-700 dark:text-red-500"
        )}
      >
        <div className="flex items-center gap-2 pl-2 mb-2">
          <Image
           src="/logo.svg" 
           alt="Neodev"
           width={18}
           height={18}
           className="shrink-0"
           />
          <span className="text-sm font-medium">Neodev</span>
          <span className="text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {format(createdAt,"HH:mm 'on' MMM dd,yyyy")}
          </span>
        </div>
        <div className="pl-8.5 flex flex-col gap-y-4 ">
          <span>{content}</span>
          {fragment &&  type==="RESULT" && (
            <FragmentCard fragment={fragment} onFragmentClick={onFragmentClick} isActive={isActive}/>
          ) }
        </div>
      </div>
    );
}

const FragmentCard = ({ fragment, onFragmentClick ,isActive}:fragmentCardProps)=>{
  return (
    <button
      className={cn(
        "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",
        isActive &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <Code2Icon className="size-4 mt-0.5 " />
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {fragment?.title}
        </span>
        <span className="text-sm">Preview</span>
      </div>
      <div className="flex items-center">
        <ChevronRight className="size-4" />
      </div>
    </button>
  );
};
const messageCard = ({
  content,
  role,
  fragment,
  type,
  createdAt,
  isActive,
  onFragmentClick,
}: MessageCardprops) => { 
  if (role === "USER") {
     return <UserCard content={content}/>
  } else {
     return <AssistantCard content={content} fragment={fragment} onFragmentClick={onFragmentClick} type={type} createdAt={createdAt} isActive={isActive} />
  }
};

export default messageCard;
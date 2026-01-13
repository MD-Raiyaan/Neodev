"use client";
import React from "react";
import Image from "next/image";
import ProjectForm from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";

export default function Home() {
  return (
    <div className="flex flex-col m-auto max-w-5xl max-auto w-full ">
       <section className="space-y-6 py-[16vh] 2xl:py-48">
         <div className="flex flex-col items-center">
           <Image
             src="/logo.svg"
             alt="Neodev"
             width={50}
             height={50}
             className="block"
           />
         </div>
         <h1 className="text-2xl md:text-5xl font-bold text-center ">
           Build something with Neodev
         </h1>
         <p className="text-lg md:text-xl text-muted-foreground text-center">
           Create apps and websites by chatting with AI
         </p>
         <div className="m-auto max-w-3xl max-auto w-full">
            <ProjectForm/>
         </div>
       </section>
       <ProjectsList />
    </div>
  );
}



"use client";
import { WebContainer } from "@webcontainer/api";
import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { useStore } from "@/hooks/useStore";

interface PreviewFrameProps {
  webContainer?: WebContainer;
}

export function PreviewFrame({ webContainer}: PreviewFrameProps) {
  let {url,setUrl}=useStore();
  async function main() {
    if (!webContainer) return;
    const installProcess = await webContainer.spawn("npm", ["install"]);
    
    await installProcess.exit;

    await webContainer.spawn("npm", ["run", "dev"]);

    webContainer.on("server-ready", (port, url) => {
      setUrl(url);
    });
  }

  useEffect(() => {
    main();
  }, []);

  if (!webContainer) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <Spinner className="mb-4" />
          <p className="mb-2">Loading WebContainer...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && (
        <div className="text-center">
          <Spinner className="mb-4" />
          <p className="mb-2">Loading Preview...</p>
        </div>
      )}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}

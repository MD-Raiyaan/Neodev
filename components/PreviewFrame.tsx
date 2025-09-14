"use client";
import { WebContainer } from "@webcontainer/api";
import React, { useEffect, useState } from "react";

interface PreviewFrameProps {
  webContainer?: WebContainer;
}

export function PreviewFrame({ webContainer }: PreviewFrameProps) {
  
  const [url, setUrl] = useState("");

  async function main() {
    if (!webContainer) return;
    const installProcess = await webContainer.spawn("npm", ["install"]);

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    console.log("DEPENDENCIES ARE INSTALLED ");

    await webContainer.spawn("npm", ["run", "dev"]);


    // Wait for `server-ready` event
    webContainer.on("server-ready", (port, url) => {
      // ...
      console.log(url);
      console.log(port);
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
          <p className="mb-2">Loading WebContainer...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && (
        <div className="text-center">
          <p className="mb-2">Loading...</p>
        </div>
      )}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}

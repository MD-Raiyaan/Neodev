"use client";

import {
  Monitor,
  Code2,
  Maximize2,
  ExternalLink,
  Download,
} from "lucide-react";
import Link from "next/link";
import { WebContainer } from "@webcontainer/api";
import { PreviewFrame } from "./PreviewFrame";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
}

interface PreviewCodeTabsProps {
  selectedFile: FileNode | null;
  activeTab: "preview" | "code";
  onFullScreen: () => void;
  onTabChange: (tab: "preview" | "code") => void;
  webContainer: WebContainer;
}

export function PreviewCodeTabs({
  selectedFile,
  activeTab,
  onTabChange,
  webContainer,
  onFullScreen,
}: PreviewCodeTabsProps) {
  const [fullscreen, setFullscreen] = useState("h-full");
  const {url}=useStore();
  const handleFullscreen = () => {
    onFullScreen();
    if (fullscreen === "h-full") setFullscreen("h-full w-screen");
    else setFullscreen("h-full");
  };

  
  const handleDownload = async () => {
    if (!webContainer) return;
    const data = await webContainer.export(".", { format: "zip" });

    // Wrap in a fresh Uint8Array (gets rid of ArrayBufferLike typing issues)
    const uint8 = new Uint8Array(data);

    const zipBlob = new Blob([uint8], { type: "application/zip" });

    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${fullscreen} flex flex-col `}>
      {/* Tab Headers */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          {/* Left side: Preview / Code tabs */}
          <div className="flex">
            <button
              onClick={() => onTabChange("preview")}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "preview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => onTabChange("code")}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "code"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Code</span>
            </button>
          </div>

          {/* Right side: Fullscreen, Download & Next Tab */}
          <div className="flex space-x-2 pr-4">
            <button
              onClick={handleFullscreen}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              title="Download Files"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              title="Next Tab"
            >
              <Link
                href={`/preview?url=${url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 min-w-0">
        {activeTab === "preview" ? (
          <div className="h-full w-full max-h-[500px] max-w-full bg-white p-4 overflow-auto">
            <PreviewFrame
              webContainer={webContainer}
            />
          </div>
        ) : (
          <div className="h-full w-full max-h-[500px] max-w-full bg-gray-900 text-gray-300 p-4 font-mono text-sm overflow-auto">
            {selectedFile && selectedFile.content ? (
              <div>
                <div className="mb-4 pb-2 border-b border-gray-700">
                  <span className="text-blue-400">{selectedFile.name}</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">
                  <code>{selectedFile.content}</code>
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    No File Selected
                  </h3>
                  <p className="text-gray-500">
                    Select a file from the explorer to view its code
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

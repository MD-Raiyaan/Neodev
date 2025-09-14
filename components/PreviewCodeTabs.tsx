"use client";

import { Monitor, Code2 } from "lucide-react";
import { WebContainer } from "@webcontainer/api";
import { PreviewFrame } from "./PreviewFrame";

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
  onTabChange: (tab: "preview" | "code") => void;
  webContainer: WebContainer;
}

export function PreviewCodeTabs({
  selectedFile,
  activeTab,
  onTabChange,
  webContainer,
}: PreviewCodeTabsProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Tab Headers */}
      <div className="border-b border-gray-200 bg-white">
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
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 min-w-0">
        {activeTab === "preview" ? (
          <div className="h-full w-full max-h-[500px] max-w-full bg-white p-4 overflow-auto">
            {/* preview tab contents  */}
            <PreviewFrame webContainer={webContainer} />
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

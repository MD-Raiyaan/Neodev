"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  path: string;
}

import { Spinner } from "./ui/spinner";

export interface FileExplorerProps {
  files: FileNode[];
  selectedFile: FileNode | null;
  onFileSelect: (file: FileNode) => void;
  loading?: boolean;
}

export function FileExplorer({
  files,
  selectedFile,
  onFileSelect,
  loading,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["1", "2", "5"])
  ); // Initially expand some folders

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const renderFileNode = (node: FileNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFile?.id === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
            isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
          }`}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.id);
            } else {
              onFileSelect(node);
            }
          }}
        >
          {node.type === "folder" ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )}
            </>
          ) : (
            <>
              <div className="w-4"></div>
              <File className="w-4 h-4 text-gray-500" />
            </>
          )}
          <span
            className={`text-sm ${
              isSelected ? "text-blue-700 font-medium" : "text-gray-700"
            }`}
          >
            {node.name}
          </span>
        </div>

        {node.type === "folder" && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Spinner className="mb-4" />
        <span className="text-gray-500">Loading files...</span>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">File Explorer</h3>
        <p className="text-sm text-gray-600">Generated website files</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {files.map((file) => renderFileNode(file))}
      </div>
    </div>
  );
}

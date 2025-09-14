"use client";

import { useState, useEffect, Suspense } from "react";
import { FileExplorer } from "@/components/FileExplorer";
import { StepsPanel } from "@/components/StepsPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewCodeTabs } from "@/components/PreviewCodeTabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { parseXml } from "@/lib/steps";
import { useWebcontainer } from "@/hooks/useWebcontainer";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
  content?: string;
}

enum StepType {
  CreateFile,
  CreateFolder,
  DeleteFile,
  EditFile,
  RunScript,
}

interface Step {
  id: number;
  title: string;
  type: StepType;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  path?: string;
  code?: string;
}

function GeneratePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [steps, setSteps] = useState<Step[]>([]);
  const webContainer = useWebcontainer();
  const [webContainerReady, setWebContainerReady] = useState(false);
  const searchparams = useSearchParams();

  useEffect(() => {
    if (webContainer) setWebContainerReady(true);
  }, [webContainer]);

  const prompt = searchparams.get("prompt");

  const getId = () =>
    Date.now().toString() + Math.random().toString(36).substring(2);

  async function init() {
    const response = await axios.post("/api/template", { prompt });
    const { prompts, uiPrompts } = response.data;
    setSteps(parseXml(uiPrompts[0]));
    const stepResponse = await axios.post("/api/chat", {
      messages: [...prompts, prompt].map((content) => {
        return {
          role: "user",
          content,
        };
      }),
    });
    const chatSteps = parseXml(stepResponse.data.message).map((x) => {
      x.status = "pending";
      return x;
    });
    setSteps((prevSteps) => [...prevSteps, ...chatSteps]);
  }

  useEffect(() => {
    let originalFileStructure = files;
    let isUpdated = false;
    steps
      .filter((x) => x.status === "pending")
      .map((step) => {
        isUpdated = true;
        if (step.type === StepType.CreateFile) {
          let currentFileStructure = [...originalFileStructure];
          const finalAnswerRef = currentFileStructure;
          let currentFolder = "";
          let parsedPath = step.path?.split("/") ?? [];
          while (parsedPath.length > 0) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);
            if (!parsedPath.length) {
              let file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  id: getId(),
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              let folder = currentFileStructure.find(
                (f) => f.path === currentFolder
              );
              if (!folder) {
                currentFileStructure.push({
                  id: getId(),
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }
              currentFileStructure = currentFileStructure.find(
                (f) => f.path === currentFolder
              )?.children!;
            }
          }
          originalFileStructure = finalAnswerRef;
        }
        if (isUpdated) {
          setFiles(originalFileStructure);
          setSteps((steps) =>
            steps.map((s: Step) => {
              return {
                ...s,
                status: "completed",
              };
            })
          );
        }
      });
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileNode[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileNode, isRootFolder: boolean) => {
        if (file.type === "folder") {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(
                  file.children.map((child) => [
                    child.name,
                    processFile(child, false),
                  ])
                )
              : {},
          };
        } else if (file.type === "file") {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || "",
              },
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }

        return mountStructure[file.name];
      };

      // Process each top-level file/folder
      files.forEach((file) => processFile(file, true));

      return mountStructure;
    };

    const mountStructure = createMountStructure(files);

    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webContainer?.mount(mountStructure);
  }, [files, webContainer]);

  useEffect(() => {
    init();
  }, []);

  if (!webContainerReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading WebContainer...
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">Neodev</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Steps and Chat */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <StepsPanel steps={steps} currentStep={currentStep} />
          <div className="h-fit border-t border-gray-200">
            <ChatPanel />
          </div>
        </div>

        {/* Middle Panel - File Explorer */}
        <div className="w-80 border-r border-gray-200 bg-white">
          <FileExplorer
            files={files}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
          />
        </div>

        {/* Right Panel - Preview/Code */}
        <div className="flex-1 bg-gray-50">
          <PreviewCodeTabs
            selectedFile={selectedFile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            webContainer={webContainer}
          />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <GeneratePage />
    </Suspense>
  );
}

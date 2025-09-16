"use client";

import { useState, useEffect, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { FileExplorer } from "@/components/FileExplorer";
import { StepsPanel } from "@/components/StepsPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewCodeTabs } from "@/components/PreviewCodeTabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { parseXml } from "@/lib/steps";
import { useWebcontainer } from "@/hooks/useWebcontainer";
import { useRouter } from "next/navigation";
import { WebContainer } from "@webcontainer/api";
import { useStore } from "@/hooks/useStore";

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
  const [llmresponses, setllmresponses] = useState<
    { role:String; content: String }[]
  >([]);
  const webContainer = useWebcontainer() as WebContainer;
  const [fullscreen, setFullscreen] = useState("");
  const [webContainerReady, setWebContainerReady] = useState(false);
  const {prompt,setUrl,updatePrompt}=useStore();
  const router = useRouter();

  useEffect(() => {
    if (webContainer) setWebContainerReady(true);
  }, [webContainer]);

  const onChatSubmit = async (message: string) => {
    const newMessages = [...llmresponses, { role: "user", content: message }];
    const stepResponse = await axios.post("/api/chat", {
      messages: newMessages,
    });
    console.log(newMessages);
    console.log(stepResponse.data);
    const chatSteps = parseXml(stepResponse.data.message).map((x) => {
      x.status = "pending";
      return x;
    });
    setSteps((prevSteps) => [...prevSteps, ...chatSteps]);
    setllmresponses(() => [
      ...newMessages,
      { role: "assistant", content: stepResponse.data.message },
    ]);
  };

  const getId = () =>
    Date.now().toString() + Math.random().toString(36).substring(2);

  async function init() {
    const response = await axios.post("/api/template", { prompt });
    console.log(response.data);
    const { prompts, uiPrompts } = response.data;
    setSteps(parseXml(uiPrompts[0]));
    const initialPrompts = [...prompts, prompt].map((content) => {
      return {
        role: "user",
        content: content as string,
      };
    });
    const stepResponse = await axios.post("/api/chat", {
      messages: initialPrompts,
    });

    const chatSteps = parseXml(stepResponse.data.message).map((x) => {
      x.status = "pending";
      return x;
    });
    setSteps((prevSteps) => [...prevSteps, ...chatSteps]);
    setllmresponses((prev) => [
      ...prev,
      ...initialPrompts,
      { role: "assistant", content: stepResponse.data.message },
    ]);
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
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }

        return mountStructure[file.name];
      };

      files.forEach((file) => processFile(file, true));

      return mountStructure;
    };

    const mountStructure = createMountStructure(files);

    console.log(mountStructure);
    webContainer?.mount(mountStructure);
  }, [files, webContainer]);

  useEffect(() => {
    init();
  }, []);

  if (!webContainerReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner className="mb-4" />
        <span className="text-gray-500">Loading WebContainer...</span>
      </div>
    );
  }

  const handleFullscreen=()=>{
     if(fullscreen==="")setFullscreen("!hidden");
     else setFullscreen("");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              onClick={() =>{
                 setUrl("");
                 updatePrompt("");
                 return router.push("/");
              }}
              variant="outline"
              className="flex items-center text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-neutral-700"></div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Neodev
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Steps + Chat */}
        <div
          className={`${fullscreen} w-96 border-r border-gray-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md flex flex-col`}
        >
          {/* Scrollable Steps */}
          <div className="flex-1 overflow-y-auto">
            <StepsPanel
              steps={steps}
              currentStep={currentStep}
              loading={steps.length === 0}
            />
          </div>

          {/* Fixed Chat at bottom */}
          <div className="border-t border-gray-200 dark:border-neutral-800">
            <ChatPanel onChat={onChatSubmit} />
          </div>
        </div>

        {/* Middle Panel - File Explorer */}
        <div
          className={`${fullscreen} w-80 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900`}
        >
          <FileExplorer
            files={files}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            loading={files.length === 0}
          />
        </div>

        {/* Right Panel - Preview/Code */}
        <div className="flex-1 bg-gray-50 dark:bg-neutral-950">
          <PreviewCodeTabs
            selectedFile={selectedFile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            webContainer={webContainer}
            onFullScreen={handleFullscreen}
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
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Spinner className="mb-4" />
          <span className="text-gray-500">Loading page...</span>
        </div>
      }
    >
      <GeneratePage />
    </Suspense>
  );
}

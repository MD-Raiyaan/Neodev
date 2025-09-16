"use client";

import { Check, Clock, AlertCircle, Play } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { motion } from "framer-motion";

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

export interface StepsPanelProps {
  steps: Step[];
  currentStep: number;
  loading?: boolean;
}

export function StepsPanel({ steps, currentStep, loading }: StepsPanelProps) {
  const getStatusIcon = (status: Step["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-5 h-5 text-green-500" />;
      case "running":
        return <Play className="w-5 h-5 text-blue-500 animate-pulse" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Step["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-700";
      case "running":
        return "bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700";
      case "error":
        return "bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-700";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-neutral-900 dark:border-neutral-800";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Spinner className="mb-4" />
        <span className="text-gray-500">Loading steps...</span>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Generation Progress
      </h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`p-4 rounded-lg border ${getStatusColor(
              step.status
            )} transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words overflow-hidden">
                  {step.description}
                </p>
                {step.status === "running" && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                      <motion.div
                        className="bg-blue-500 h-1 rounded-full"
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: "easeInOut",
                        }}
                        style={{ width: "60%" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { Check, Clock, AlertCircle, Play } from 'lucide-react';

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

interface StepsPanelProps {
  steps: Step[];
  currentStep: number;
}

export function StepsPanel({ steps, currentStep }: StepsPanelProps) {
  const getStatusIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Play className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-200';
      case 'running':
        return 'bg-blue-100 border-blue-200';
      case 'error':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Generation Progress</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg border ${getStatusColor(step.status)} transition-all duration-200`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                {step.status === 'running' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
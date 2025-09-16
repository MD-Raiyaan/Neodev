"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";

function PreviewPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";

  if (!url)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No URL Provided
          </h2>
          <p className="text-gray-500 text-center max-w-xs">
            Please provide a valid URL to preview the page.
            <br />
            You can do this by selecting a file or using the preview feature
            from the editor.
          </p>
        </div>
      </div>
    );

  return (
    <div className="w-screen h-screen">
      <iframe
        src={url}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
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
      <PreviewPage />
    </Suspense>
  );
}

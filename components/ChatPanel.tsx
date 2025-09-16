"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export function ChatPanel({
  onChat,
}: {
  onChat: (message: string) => Promise<void>;
}) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    try {
      console.log("input sent");
      await onChat(inputValue.trim());
      setInputValue("");
    } finally {
      setLoading(false);
    }
  };

  // Auto-grow textarea height up to a max
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 180) + "px"; // cap at ~180px
    }
  }, [inputValue]);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-start px-4 pb-6">
      <div
        className="w-[600px] relative bg-white dark:bg-neutral-900 
        border border-gray-200 dark:border-neutral-700 
        rounded-2xl shadow-xl p-3"
      >
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSendMessage())
          }
          placeholder="💡 Describe what you want to change in your website..."
          rows={4} // taller default height
          className="w-full resize-none rounded-xl px-4 py-3 text-base 
          bg-transparent text-gray-900 dark:text-gray-100 
          focus:outline-none pr-14 max-h-[180px] overflow-y-auto 
          scrollbar-none"
        />

        <button
          onClick={handleSendMessage}
          className="absolute right-4 bottom-4 bg-blue-600 hover:bg-blue-700 text-white 
          rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
          aria-label="Send prompt"
          disabled={loading}
        >
          {loading ? (
            <span className="loader w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      <style jsx global>{`
        .loader {
          display: inline-block;
          border-radius: 50%;
          border-width: 2px;
          border-style: solid;
          border-color: white white transparent white;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        /* Hide scrollbar but allow scroll */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none; /* IE/Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}

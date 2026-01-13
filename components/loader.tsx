import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

// Enhanced ShadCN-style Loader Component with multiple variants
export default function Loader({
  variant = "spinner",
  size = "md",
  className,
}: {
  variant?:
    | "spinner"
    | "dot-pulse"
    | "cube"
    | "skeleton"
    | "card"
    | "fullscreen";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  // Adaptive dark-mode colors
  const baseColor = "text-primary dark:text-primary";

  // Variant: Pure Spinner
  if (variant === "spinner") {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className={cn("animate-spin", baseColor, sizes[size], className)}
        />
      </div>
    );
  }

  // Variant: Dot Pulse Loader
  if (variant === "dot-pulse") {
    return (
      <div className="flex gap-2 p-6 justify-center items-center">
        <span className="h-3 w-3 rounded-full bg-primary dark:bg-primary animate-bounce" />
        <span className="h-3 w-3 rounded-full bg-primary dark:bg-primary animate-bounce [animation-delay:0.15s]" />
        <span className="h-3 w-3 rounded-full bg-primary dark:bg-primary animate-bounce [animation-delay:0.3s]" />
      </div>
    );
  }

  // Variant: Skeleton blocks
  if (variant === "skeleton") {
    return (
      <div className="space-y-3 p-6 w-full max-w-sm">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  // Variant: Fullscreen overlay loader
  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Loader2 className="animate-spin h-12 w-12 text-primary dark:text-primary" />
      </div>
    );
  }

  return null;
}

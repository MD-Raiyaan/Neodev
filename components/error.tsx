import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

// Clean, modern, ShadCN-styled Error Page Component
export default function ErrorPage({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  showHome = true,
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6 dark:bg-background">
      <Card className="max-w-md w-full shadow-lg p-4">
        <CardHeader className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{message}</p>

          {showHome && (
            <Link href="/">
              <Button variant="default" className="w-full">
                Go Back Home
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

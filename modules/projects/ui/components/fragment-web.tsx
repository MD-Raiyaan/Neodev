import { Fragment } from "@/lib/generated/prisma/client";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
interface props {
  data: Fragment;
}

export default function FragmentWeb({ data }: props) {
  const [fragmentKey,setActiveFragmentkey]=useState(0);
  const [copied,setCopied]=useState(false);
  const onRefresh=()=>{
    setActiveFragmentkey((prev)=>prev+1);
  }
  const handleCopy=()=>{
    navigator.clipboard.writeText(data.sandboxurl);
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  }
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="click to refresh" side="bottom">
        <Button size="sm" variant="outline" onClick={onRefresh}>
          <RefreshCcwIcon />
        </Button>
        </Hint>
        <Hint text="click to copy" side="bottom">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={copied}
            className="flex-1 justify-start text-start font-normal"
          >
            <span className="truncate">{data.sandboxurl}</span>
          </Button>
        </Hint>
        <Hint text="Open in new tab" side="bottom" align="start">
          <Button
            size="sm"
            disabled={!data.sandboxurl}
            variant="outline"
            onClick={() => {
              if (!data.sandboxurl) return;
              window.open(data.sandboxurl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxurl}
      />
    </div>
  );
}

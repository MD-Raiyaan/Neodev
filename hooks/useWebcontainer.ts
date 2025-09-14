"use client";
import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

let singletonInstance: WebContainer | null = null; // singleton

export function useWebcontainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | undefined>();

  useEffect(() => {
    if (singletonInstance) {
      // Use existing instance
      setWebcontainer(singletonInstance);
      return;
    }

    async function init() {
      singletonInstance = await WebContainer.boot();
      setWebcontainer(singletonInstance);
    }

    init();
  }, []);

  return webcontainer;
}

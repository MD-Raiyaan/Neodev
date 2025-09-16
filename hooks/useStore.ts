import { create } from "zustand";

interface Store {
  prompt: string;
  url:string;
  setUrl: (url: string) => void;
  updatePrompt: (prompt: string) => void;
}

export const useStore = create<Store>((set) => ({
  prompt: "",
  url:"",
  updatePrompt: (prompt: string) => set({ prompt }),
  setUrl:(url:string)=>set({url})
}));

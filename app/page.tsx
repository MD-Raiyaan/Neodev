"use client";
import { ArrowRight, Code, Zap, Globe, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../hooks/useStore";

export default function Home() {
  const {setUrl,updatePrompt}=useStore();
  
  useEffect(()=>{
    setUrl("");
    updatePrompt("");
  },[]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Neodev</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-300">
            <a
              href="#features"
              className="hover:text-white transition-colors hidden md:inline"
            >
              Features
            </a>
            <a
              href="#about"
              className="hover:text-white transition-colors hidden md:inline"
            >
              About
            </a>
            <a
              href="#contact"
              className="hover:text-white transition-colors hidden md:inline"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-gray-300 bg-gray-800 px-3 py-1 rounded-full">
                Powered by Advanced AI
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Build Websites with
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                {" "}
                AI Magic
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into beautiful, functional websites in
              minutes. Just describe what you want, and our AI will build it for
              you.
            </p>

            <PromptForm />

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-400 text-sm">
                  Generate complete websites in under 60 seconds
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <Code className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Clean Code
                </h3>
                <p className="text-gray-400 text-sm">
                  Production-ready, optimized code that just works
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <Globe className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Responsive
                </h3>
                <p className="text-gray-400 text-sm">
                  Mobile-first design that looks great everywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function PromptForm() {
  const router = useRouter();
  const { updatePrompt } = useStore();

  const [prompt, setPrompt] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt && prompt.trim()) {
      updatePrompt(prompt);
      router.push(`/generate`);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-200 mb-3"
          >
            Describe your website idea
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="E.g., Create a modern portfolio website for a photographer with a gallery, about section, and contact form. Use a dark theme with elegant animations."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 group"
        >
          <span>Start Building</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}

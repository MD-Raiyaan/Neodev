"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn,SignedOut,SignInButton,SignUpButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { UserControl } from "./user-control";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const Navbar =()=>{
    const { theme, setTheme } = useTheme();
    return (
      <nav className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Neodev" width={24} height={24} />
            <span className="font-semibold text-lg">Neodev</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <SignedOut>
              <div className="flex gap-2">
                <SignUpButton>
                  <Button variant="outline" size="sm">
                    Sign up
                  </Button>
                </SignUpButton>
                <SignInButton>
                  <Button size="sm">Sign In</Button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserControl showName />
            </SignedIn>
          </div>
        </div>
      </nav>
    );
}
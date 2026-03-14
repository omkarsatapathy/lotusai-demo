import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { withBase } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <a href={withBase("/")} className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8">
            <img src="/Lotus AI logo.png" alt="Lotus AI" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Lotus AI Studio
          </span>
        </a>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

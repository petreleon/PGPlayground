"use client";

import { Sidebar } from "@/components/sidebar";
import { ReactNode, useState } from "react";
import { Menu, Database } from "lucide-react";
import Link from "next/link";

export default function TutorialLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 lg:hidden">
        <Link href="/" className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
          <Database className="w-5 h-5" />
          SQL Basics
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 px-4 py-6 lg:p-8 lg:max-w-4xl w-full">
        {children}
      </main>
    </div>
  );
}

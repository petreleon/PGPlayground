import Link from "next/link";
import { Database, ArrowRight, Code, Zap, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
            <Database className="w-5 h-5" />
            SQL Basics
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="https://pglite.dev/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">PGlite</a>
            <a href="https://www.postgresql.org/docs/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">PostgreSQL Docs</a>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Browser-based PostgreSQL
          </div>
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 leading-tight">
            Learn SQL by Doing
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
            An interactive tutorial for beginners. Create tables, alter columns, manage keys — 
            all with a real PostgreSQL database running right in your browser. No installs, no servers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tutorial"
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors text-lg"
            >
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left">
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <Code className="w-6 h-6 text-emerald-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Interactive Editor</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Type SQL and see results instantly with syntax highlighting and error feedback.</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <Database className="w-6 h-6 text-blue-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Real PostgreSQL</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Powered by PGlite — a real Postgres engine compiled to WebAssembly for the browser.</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <BookOpen className="w-6 h-6 text-purple-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Beginner Friendly</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Covers CREATE, ALTER, DROP, Primary Keys, and Foreign Keys with guided examples.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

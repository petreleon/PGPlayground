"use client";

import { ReactNode } from "react";
import { Lightbulb, AlertTriangle, Info } from "lucide-react";

interface TutorialSectionProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function TutorialSection({ id, title, description, children }: TutorialSectionProps) {
  return (
    <section id={id} className="mb-16 scroll-mt-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h2>
        <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 my-3">
      <pre className="text-sm font-mono text-zinc-800 dark:text-zinc-200 overflow-x-auto">{children}</pre>
    </div>
  );
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4 my-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-sm text-amber-800 dark:text-amber-300">
      <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4 my-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-400">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

export function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4 my-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-sm text-blue-700 dark:text-blue-300">
      <Info className="w-4 h-4 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-2">{title}</h3>
      {children}
    </div>
  );
}

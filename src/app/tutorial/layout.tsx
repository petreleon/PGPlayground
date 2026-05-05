import { Sidebar } from "@/components/sidebar";
import { ReactNode } from "react";

export default function TutorialLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        {children}
      </main>
    </div>
  );
}

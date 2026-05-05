import Link from "next/link";
import { InfoBox } from "@/components/tutorial-section";
import { Table, Key, FileText, Layers, Trash2, Database } from "lucide-react";

const pages = [
  { href: "/tutorial/getting-started", title: "Getting Started", desc: "CREATE TABLE and data types", icon: Database },
  { href: "/tutorial/alter-table", title: "ALTER TABLE", desc: "Add, rename, drop, and modify columns", icon: Table },
  { href: "/tutorial/keys", title: "Keys & Constraints", desc: "Primary keys, foreign keys, and dropping constraints", icon: Key },
  { href: "/tutorial/writing-data", title: "Writing Data", desc: "INSERT, UPDATE, UPSERT, and DELETE", icon: Table },
  { href: "/tutorial/querying-data", title: "Querying Data", desc: "SELECT, WHERE, JOINs, GROUP BY, subqueries, CTEs", icon: Table },
  { href: "/tutorial/expressions", title: "SQL Expressions", desc: "CASE, COALESCE, NULLIF, string functions, JSON/JSONB", icon: FileText },
  { href: "/tutorial/advanced", title: "Advanced", desc: "Transactions, window functions, set operations, views", icon: Layers },
  { href: "/tutorial/cleanup", title: "Cleanup", desc: "DROP TABLE and resetting the database", icon: Trash2 },
];

export default function TutorialPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">SQL Basics Tutorial</h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-4">
          Learn PostgreSQL table operations right in your browser.
          Type SQL, press <strong>Run SQL</strong>, and watch your database change in real-time.
        </p>
        <InfoBox>
          This tutorial uses <a href="https://pglite.dev/" className="underline" target="_blank" rel="noopener noreferrer">PGlite</a> — a real PostgreSQL database
          that runs entirely in your browser. The database persists between refreshes using IndexedDB.
          Use the <strong>Reset DB</strong> button anytime to start fresh.
        </InfoBox>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="block p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <page.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{page.title}</h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{page.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

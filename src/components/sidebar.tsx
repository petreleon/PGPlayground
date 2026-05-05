"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Table, Key, Trash2, ChevronRight, FileText, Layers } from "lucide-react";

interface Topic {
  id: string;
  label: string;
}

interface Section {
  title: string;
  icon: any;
  href: string;
  topics: Topic[];
}

const sections: Section[] = [
  {
    title: "Getting Started",
    icon: Database,
    href: "/tutorial/getting-started",
    topics: [
      { id: "create-table", label: "CREATE TABLE" },
      { id: "data-types", label: "Data Types" },
    ],
  },
  {
    title: "ALTER TABLE",
    icon: Table,
    href: "/tutorial/alter-table",
    topics: [
      { id: "add-column", label: "Add Column" },
      { id: "rename-column", label: "Rename Column" },
      { id: "drop-column", label: "Drop Column" },
      { id: "alter-type", label: "Change Data Type" },
    ],
  },
  {
    title: "Keys & Constraints",
    icon: Key,
    href: "/tutorial/keys",
    topics: [
      { id: "primary-key", label: "Primary Keys" },
      { id: "foreign-key", label: "Foreign Keys" },
      { id: "drop-constraint", label: "Drop Constraints" },
    ],
  },
  {
    title: "Writing Data",
    icon: Table,
    href: "/tutorial/writing-data",
    topics: [
      { id: "insert", label: "INSERT INTO" },
      { id: "update", label: "UPDATE" },
      { id: "upsert", label: "UPSERT" },
      { id: "delete", label: "DELETE" },
    ],
  },
  {
    title: "Querying Data",
    icon: Table,
    href: "/tutorial/querying-data",
    topics: [
      { id: "select", label: "SELECT" },
      { id: "where", label: "WHERE" },
      { id: "order-by", label: "ORDER BY & LIMIT" },
      { id: "joins", label: "JOINs" },
      { id: "group-by", label: "GROUP BY" },
      { id: "subqueries", label: "Subqueries & CTEs" },
    ],
  },
  {
    title: "SQL Expressions",
    icon: FileText,
    href: "/tutorial/expressions",
    topics: [
      { id: "case", label: "CASE" },
      { id: "coalesce", label: "COALESCE & NULLIF" },
      { id: "string-functions", label: "String Functions" },
      { id: "json", label: "JSON / JSONB" },
    ],
  },
  {
    title: "Advanced",
    icon: Layers,
    href: "/tutorial/advanced",
    topics: [
      { id: "transactions", label: "Transactions" },
      { id: "window-functions", label: "Window Functions" },
      { id: "set-operations", label: "Set Operations" },
      { id: "views", label: "Views" },
    ],
  },
  {
    title: "Cleanup",
    icon: Trash2,
    href: "/tutorial/cleanup",
    topics: [
      { id: "drop-table", label: "DROP TABLE" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto sticky top-0">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
          <Database className="w-5 h-5" />
          SQL Basics
        </Link>
        <p className="text-xs text-zinc-500 mt-1">Interactive PostgreSQL Tutorial</p>
      </div>
      <nav className="p-2">
        {sections.map((section) => {
          const isActive = pathname === section.href;
          return (
            <div key={section.title} className="mb-4">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <section.icon className="w-3.5 h-3.5" />
                {section.title}
              </div>
              <Link
                href={section.href}
                className={`flex flex-col px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  {section.topics.map((topic) => (
                    <div key={topic.id} className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-zinc-300 shrink-0" />
                      <span className="text-xs text-zinc-500">{topic.label}</span>
                    </div>
                  ))}
                </div>
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

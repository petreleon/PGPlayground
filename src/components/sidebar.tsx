"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Table, Key, Trash2, ChevronRight } from "lucide-react";

const sections = [
  {
    title: "Getting Started",
    icon: Database,
    items: [
      { id: "create-table", label: "CREATE TABLE", desc: "Creating your first table" },
      { id: "data-types", label: "Data Types", desc: "Integer, text, boolean and more" },
    ],
  },
  {
    title: "ALTER TABLE",
    icon: Table,
    items: [
      { id: "add-column", label: "Add Column", desc: "Adding new columns to existing tables" },
      { id: "rename-column", label: "Rename Column", desc: "Renaming existing columns" },
      { id: "drop-column", label: "Drop Column", desc: "Removing columns from tables" },
      { id: "alter-type", label: "Change Data Type", desc: "Modifying column data types" },
    ],
  },
  {
    title: "Keys & Constraints",
    icon: Key,
    items: [
      { id: "primary-key", label: "Primary Keys", desc: "Creating and altering primary keys" },
      { id: "foreign-key", label: "Foreign Keys", desc: "Creating and altering foreign keys" },
      { id: "drop-constraint", label: "Drop Constraints", desc: "Removing keys and constraints" },
    ],
  },
  {
    title: "Cleanup",
    icon: Trash2,
    items: [
      { id: "drop-table", label: "DROP TABLE", desc: "Deleting tables from the database" },
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
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <section.icon className="w-3.5 h-3.5" />
              {section.title}
            </div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-zinc-400">{item.desc}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

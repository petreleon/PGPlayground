"use client";

import { usePGlite } from "@/lib/pglite-provider";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Play, RotateCcw, CheckCircle, AlertCircle, Loader2, Table } from "lucide-react";

interface QueryResult {
  columns: string[];
  rows: any[];
}

export interface SQLRunnerProps {
  initialSql?: string;
  hint?: string;
}

export function SQLRunner({ initialSql = "", hint }: SQLRunnerProps) {
  const { db, ready } = usePGlite();
  const [sql, setSql] = useState(initialSql);
  const [results, setResults] = useState<Array<QueryResult> | null>(null);
  const [affectedRows, setAffectedRows] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbState, setDbState] = useState<{ tables: string[]; schema: Record<string, { columns: string[] }> }>({ tables: [], schema: {} });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const fetchDbState = useCallback(async () => {
    if (!db) return;
    try {
      const tableRes = await db.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename
      `);
      const tables = tableRes.rows.map((r: any) => r.tablename);
      
      const schema: Record<string, { columns: string[] }> = {};
      for (const table of tables) {
        const colRes = await db.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position
        `, [table]);
        schema[table] = { columns: colRes.rows.map((r: any) => `${r.column_name} (${r.data_type})`) };
      }
      setDbState({ tables, schema });
    } catch {
      // ignore
    }
  }, [db]);

  const runSQL = useCallback(async () => {
    if (!db || !sql.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setAffectedRows(null);
    
    try {
      const trimmed = sql.trim();
      if (/^\s*SELECT\s+/i.test(trimmed)) {
        const res = await db.query(trimmed);
        setResults([{
          columns: res.fields.map((f: any) => f.name),
          rows: res.rows,
        }]);
      } else {
        const res = await db.exec(trimmed);
        if (Array.isArray(res) && res.length > 0) {
          const queryResults: QueryResult[] = [];
          let totalAffected = 0;
          for (const r of res) {
            if (r.rows && r.rows.length > 0) {
              queryResults.push({
                columns: r.fields?.map((f: any) => f.name) ?? Object.keys(r.rows[0]),
                rows: r.rows,
              });
            } else if (r.rows !== undefined) {
              totalAffected += r.affectedRows || 0;
            }
          }
          if (queryResults.length > 0) {
            setResults(queryResults);
          } else {
            setAffectedRows(totalAffected);
          }
        } else {
          setAffectedRows(0);
        }
      }
      fetchDbState();
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [db, sql, fetchDbState]);

  const resetDatabase = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const tableRes = await db.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public'
      `);
      const tables = tableRes.rows.map((r: any) => r.tablename);
      for (const table of tables) {
        await db.exec(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      }
      setSql("");
      setResults([]);
      setError(null);
      setAffectedRows(null);
      fetchDbState();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [db, fetchDbState]);

  const syntaxHighlighted = useMemo(() => {
    if (!sql) return "";
    let html = sql
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const keywords = [
      "CREATE", "TABLE", "ALTER", "DROP", "COLUMN", "CONSTRAINT", "PRIMARY", "KEY",
      "FOREIGN", "REFERENCES", "UNIQUE", "NOT", "NULL", "DEFAULT", "SERIAL",
      "INT", "INTEGER", "BIGINT", "VARCHAR", "TEXT", "BOOLEAN", "DATE", "TIMESTAMP",
      "NUMERIC", "DECIMAL", "FLOAT", "REAL", "DOUBLE", "PRECISION", "CHAR",
      "ON", "DELETE", "UPDATE", "CASCADE", "SET", "ADD", "RENAME", "TO",
      "TYPE", "IF", "EXISTS", "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES",
      "AND", "OR", "ORDER", "BY", "ASC", "DESC", "LIMIT",
      "BEGIN", "COMMIT", "ROLLBACK", "TRANSACTION"
    ];

    // Build a single regex from all keywords
    const kwPattern = keywords.map(k => `\\b${k}\\b`).join("|");
    const kwRegex = new RegExp(`(${kwPattern})`, "gi");
    html = html.replace(kwRegex, '<span class="text-purple-600 font-semibold dark:text-purple-400">$1</span>');

    html = html.replace(/('[^']*')/g, '<span class="text-emerald-600 dark:text-emerald-400">$1</span>');
    // Only color numbers that are not inside already-colored spans
    html = html.replace(/>(\d+)</g, '><span class="text-amber-600 dark:text-amber-400">$1</span><');
    // Numbers at boundaries
    html = html.replace(/^(\d+)</gm, '<span class="text-amber-600 dark:text-emerald-400">$1</span><');
    html = html.replace(/>(\d+)$/gm, '><span class="text-amber-600 dark:text-amber-400">$1</span>');
    html = html.replace(/(--.*)$/gm, '<span class="text-zinc-400 italic">$1</span>');
    return html;
  }, [sql]);

  // Auto-resize textarea + sync scroll
  useEffect(() => {
    const el = textareaRef.current;
    const ov = overlayRef.current;
    if (!el || !ov) return;
    // Reset height to auto so scrollHeight is the natural height
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;

    const syncScroll = () => {
      if (ov) ov.scrollTop = el.scrollTop;
    };
    el.addEventListener("scroll", syncScroll, { passive: true });
    return () => el.removeEventListener("scroll", syncScroll);
  }, [sql]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-zinc-500" />
            <span className="text-sm font-mono text-zinc-500">SQL Editor</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetDatabase}
              disabled={loading || !ready}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset DB
            </button>
            <button
              onClick={runSQL}
              disabled={loading || !ready}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Run SQL
            </button>
          </div>
        </div>
        <div className="relative border border-zinc-200 dark:border-zinc-700 rounded-lg">
          <div
            ref={overlayRef}
            className="p-3 text-sm font-mono whitespace-pre-wrap break-words overflow-auto min-h-[5rem] max-h-[20rem] pointer-events-none select-none"
            dangerouslySetInnerHTML={{ __html: syntaxHighlighted || "\u00a0" }}
          />
          <textarea
            ref={textareaRef}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            className="absolute inset-0 w-full h-full p-3 text-sm font-mono bg-transparent overflow-auto text-transparent caret-zinc-900 dark:caret-zinc-100 border-0 focus:outline-none focus:ring-0 resize-none"
            placeholder="Write your SQL here..."
            spellCheck={false}
            style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word", wordBreak: "break-word" }}
          />
        </div>
        {hint && (
          <div className="flex items-start gap-2 text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800 p-2 rounded-md border border-zinc-100 dark:border-zinc-800">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-500" />
            <span>{hint}</span>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <pre className="font-mono text-xs whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {affectedRows !== null && !error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Query executed successfully. Affected rows: {affectedRows}</span>
          </div>
        )}

        {results && results.length > 0 && !error && (
          <div className="flex flex-col gap-4">
            {results.map((res, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                <div className="overflow-auto max-h-80">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800 sticky top-0">
                      <tr>
                        {res.columns.map((col) => (
                          <th key={col} className="px-3 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {res.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                          {res.columns.map((col) => (
                            <td key={col} className="px-3 py-2 text-zinc-600 dark:text-zinc-400 font-mono text-xs whitespace-nowrap">
                              {row[col] === null ? (
                                <span className="text-zinc-400 italic">NULL</span>
                              ) : typeof row[col] === "boolean" ? (
                                row[col] ? "true" : "false"
                              ) : (
                                String(row[col])
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {res.rows.length === 0 && (
                        <tr>
                          <td colSpan={res.columns.length} className="px-3 py-6 text-center text-zinc-400 italic">
                            No rows returned
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live DB State */}
      {dbState.tables.length > 0 && (
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2">
            <Table className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Database Tables</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dbState.tables.map((table) => (
              <div key={table} className="group relative">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-100 dark:border-blue-900 cursor-help">
                  {table}
                </span>
                {dbState.schema[table]?.columns.length > 0 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-64">
                    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-2">
                      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{table} columns:</div>
                      <div className="flex flex-col gap-0.5">
                        {dbState.schema[table].columns.map((col) => (
                          <span key={col} className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">{col}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

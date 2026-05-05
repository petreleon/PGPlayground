"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

interface PGliteContextType {
  db: any | null;
  ready: boolean;
  error: string | null;
}

const PGliteContext = createContext<PGliteContextType>({
  db: null,
  ready: false,
  error: null,
});

export function PGliteProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<any | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const { PGlite } = await import("@electric-sql/pglite");
        if (!mounted) return;
        const instance = new PGlite("idb://sql-tutorial-db");
        await instance.waitReady;
        if (!mounted) return;
        setDb(instance);
        setReady(true);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Failed to initialize PGlite");
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PGliteContext.Provider value={{ db, ready, error }}>
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900 rounded-lg p-6 shadow-lg max-w-md mx-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Database Initialization Failed</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{error}</p>
                <p className="text-xs text-zinc-500">
                  Reload the page to try again. If the problem persists, try clearing IndexedDB from your browser&apos;s developer tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </PGliteContext.Provider>
  );
}

export function usePGlite() {
  return useContext(PGliteContext);
}

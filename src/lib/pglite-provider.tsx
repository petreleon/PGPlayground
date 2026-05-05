"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
      {children}
    </PGliteContext.Provider>
  );
}

export function usePGlite() {
  return useContext(PGliteContext);
}

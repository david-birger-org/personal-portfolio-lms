"use client";

import { useCallback, useEffect, useState } from "react";

import {
  MonobankPaymentsDataTable,
  type StatementItem,
} from "@/components/admin/MonobankPaymentsDataTable";

interface StatementResponse {
  list?: StatementItem[];
  error?: string;
}

export function MonobankPaymentsHistory() {
  const [rows, setRows] = useState<StatementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatement = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/monobank/statement?days=90", {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json()) as StatementResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load payment history");
      }

      const list = Array.isArray(payload.list) ? payload.list : [];
      const sorted = [...list].sort((a, b) => {
        const aTime = a.date ? new Date(a.date).getTime() : 0;
        const bTime = b.date ? new Date(b.date).getTime() : 0;
        return bTime - aTime;
      });

      setRows(sorted);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Unexpected error";
      setError(message);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatement();
  }, [loadStatement]);

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-destructive border-destructive/50 rounded-2xl border px-4 py-3 text-sm">
          {error}
        </p>
      )}
      <MonobankPaymentsDataTable
        data={rows}
        isLoading={isLoading}
        onRefresh={() => void loadStatement()}
      />
    </div>
  );
}

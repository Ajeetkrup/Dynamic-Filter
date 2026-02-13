import { useState, useCallback } from "react";
import type { FilterCondition, Operator, FilterValue } from "../types/filter";
import { saveFilters, loadFilters } from "../utils/persistence";

let nextId = 1;

function generateId(): string {
    return `filter-${nextId++}-${Date.now()}`;
}

export function useFilters(persistenceEnabled = true) {
    const [conditions, setConditions] = useState<FilterCondition[]>(() => {
        if (persistenceEnabled) {
            const saved = loadFilters();
            if (saved.length > 0) return saved;
        }
        return [];
    });

    const persist = useCallback(
        (updated: FilterCondition[]) => {
            if (persistenceEnabled) saveFilters(updated);
        },
        [persistenceEnabled]
    );

    const addFilter = useCallback(() => {
        setConditions((prev) => {
            const updated = [
                ...prev,
                { id: generateId(), fieldKey: "", operator: "" as Operator, value: "" as FilterValue },
            ];
            persist(updated);
            return updated;
        });
    }, [persist]);

    const removeFilter = useCallback(
        (id: string) => {
            setConditions((prev) => {
                const updated = prev.filter((c) => c.id !== id);
                persist(updated);
                return updated;
            });
        },
        [persist]
    );

    const updateFilter = useCallback(
        (id: string, patch: Partial<FilterCondition>) => {
            setConditions((prev) => {
                const updated = prev.map((c) => (c.id === id ? { ...c, ...patch } : c));
                persist(updated);
                return updated;
            });
        },
        [persist]
    );

    const clearFilters = useCallback(() => {
        setConditions([]);
        persist([]);
    }, [persist]);

    return { conditions, addFilter, removeFilter, updateFilter, clearFilters };
}

import type { FilterCondition } from "../types/filter";

const STORAGE_KEY = "dynamic-filter-conditions";

export function saveFilters(filters: FilterCondition[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
        /* quota exceeded — silently ignore */
    }
}

export function loadFilters(): FilterCondition[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as FilterCondition[];
    } catch {
        return [];
    }
}

export function clearPersistedFilters(): void {
    localStorage.removeItem(STORAGE_KEY);
}

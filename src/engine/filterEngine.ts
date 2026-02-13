/**
 * Client-side filter engine.
 *
 * Design decisions:
 * - Pure functions: every matcher is side-effect-free and independently testable.
 * - AND between fields, OR within the same field: gives intuitive "narrow down" UX.
 * - A FieldDefinition-keyed Map is built once per filter pass for O(1) lookups.
 * - `isValidFilter` guards ensure incomplete rows are silently skipped.
 */

import dayjs from "dayjs";
import { FieldType } from "../types/filter";
import type {
    FilterCondition,
    FieldDefinition,
    FilterValue,
    DateRange,
    NumberRange,
} from "../types/filter";

/* ─── Nested Value Access ─────────────────────────────────────────────── */

/**
 * Safely traverses a dot-notated path (e.g. "address.city") on a record.
 * Returns `undefined` when any segment is missing — never throws.
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split(".").reduce<unknown>((acc, key) => {
        if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj);
}

/* ─── Text Matchers ───────────────────────────────────────────────────── */

/**
 * All text comparisons are case-insensitive.
 * The "regex" operator wraps the value in a try/catch so invalid patterns fail
 * gracefully instead of crashing the app.
 */
function matchText(value: string, filterValue: string, operator: string): boolean {
    const v = value.toLowerCase();
    const f = filterValue.toLowerCase();
    switch (operator) {
        case "equals":
            return v === f;
        case "contains":
            return v.includes(f);
        case "startsWith":
            return v.startsWith(f);
        case "endsWith":
            return v.endsWith(f);
        case "doesNotContain":
            return !v.includes(f);
        case "regex": {
            try {
                const re = new RegExp(filterValue, "i");
                return re.test(value);
            } catch {
                // Invalid regex pattern — treat as non-match rather than crashing
                return false;
            }
        }
        default:
            return false;
    }
}

/* ─── Number Matchers ─────────────────────────────────────────────────── */

/**
 * Handles NaN gracefully: if the record value isn't a valid number the
 * condition evaluates to false.
 */
function matchNumber(value: number, filterValue: number | NumberRange, operator: string): boolean {
    if (Number.isNaN(value)) return false;

    // "numberBetween" operator receives a NumberRange instead of a single number
    if (operator === "numberBetween") {
        const range = filterValue as NumberRange;
        const min = range.min === "" ? -Infinity : Number(range.min);
        const max = range.max === "" ? Infinity : Number(range.max);
        return value >= min && value <= max;
    }

    const fv = Number(filterValue);
    if (Number.isNaN(fv)) return false;

    switch (operator) {
        case "eq":
            return value === fv;
        case "neq":
            return value !== fv;
        case "gt":
            return value > fv;
        case "lt":
            return value < fv;
        case "gte":
            return value >= fv;
        case "lte":
            return value <= fv;
        default:
            return false;
    }
}

/* ─── Date Matchers ───────────────────────────────────────────────────── */

/**
 * Supports range-based ("between"), directional ("before" / "after"), and
 * relative operators ("last7days", "last30days", "last90days").
 * Invalid dates return false instead of throwing.
 */
function matchDate(
    value: string,
    filterValue: DateRange | string,
    operator: string
): boolean {
    const date = dayjs(value);
    if (!date.isValid()) return false;

    switch (operator) {
        case "between": {
            const range = filterValue as DateRange;
            const start = range.start ? dayjs(range.start) : null;
            const end = range.end ? dayjs(range.end) : null;
            if (start && end)
                return (
                    (date.isAfter(start) || date.isSame(start, "day")) &&
                    (date.isBefore(end) || date.isSame(end, "day"))
                );
            if (start) return date.isAfter(start) || date.isSame(start, "day");
            if (end) return date.isBefore(end) || date.isSame(end, "day");
            return true;
        }
        case "before": {
            const range = filterValue as DateRange;
            const end = range.end ? dayjs(range.end) : (range.start ? dayjs(range.start) : null);
            return end ? date.isBefore(end, "day") : true;
        }
        case "after": {
            const range = filterValue as DateRange;
            const start = range.start ? dayjs(range.start) : (range.end ? dayjs(range.end) : null);
            return start ? date.isAfter(start, "day") : true;
        }
        case "last7days":
            return date.isAfter(dayjs().subtract(7, "day"));
        case "last30days":
            return date.isAfter(dayjs().subtract(30, "day"));
        case "last90days":
            return date.isAfter(dayjs().subtract(90, "day"));
        default:
            return false;
    }
}

/* ─── Amount / Currency Range Matcher ─────────────────────────────────── */

function matchAmountRange(value: number, range: NumberRange): boolean {
    if (Number.isNaN(value)) return false;
    const min = range.min === "" ? -Infinity : Number(range.min);
    const max = range.max === "" ? Infinity : Number(range.max);
    return value >= min && value <= max;
}

/* ─── Select Matchers ─────────────────────────────────────────────────── */

function matchSingleSelect(value: string, filterValue: string, operator: string): boolean {
    switch (operator) {
        case "is":
            return value === filterValue;
        case "isNot":
            return value !== filterValue;
        default:
            return false;
    }
}

/**
 * Multi-select matching:
 * - "in"     → record contains ANY of the selected values (OR logic)
 * - "notIn"  → record contains NONE of the selected values
 * - "all"    → record contains ALL of the selected values (AND logic)
 */
function matchMultiSelect(
    values: string[],
    filterValues: string[],
    operator: string
): boolean {
    if (!Array.isArray(values)) return false;
    if (filterValues.length === 0) return true;
    switch (operator) {
        case "in":
            return filterValues.some((fv) => values.includes(fv));
        case "notIn":
            return !filterValues.some((fv) => values.includes(fv));
        case "all":
            return filterValues.every((fv) => values.includes(fv));
        default:
            return false;
    }
}

/* ─── Boolean Matcher ─────────────────────────────────────────────────── */

function matchBoolean(value: unknown, filterValue: boolean): boolean {
    return Boolean(value) === filterValue;
}

/* ─── Validation ──────────────────────────────────────────────────────── */

/**
 * Determines whether a filter condition has enough data to be applied.
 * Incomplete rows (e.g. user hasn't selected a field yet) are skipped,
 * so partial input never causes runtime errors.
 *
 * Relative date operators (last7/30/90 days) are always valid once the
 * field + operator are set — they don't need a user-provided value.
 */
function isValidFilter(condition: FilterCondition): boolean {
    if (!condition.fieldKey || !condition.operator) return false;

    // Relative date operators don't require a value
    if (["last7days", "last30days", "last90days"].includes(condition.operator)) return true;

    const v = condition.value;
    if (v === undefined || v === null) return false;
    if (typeof v === "string" && v === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    if (typeof v === "object" && "start" in v && "end" in v) {
        const dr = v as DateRange;
        return dr.start !== "" || dr.end !== "";
    }
    if (typeof v === "object" && "min" in v && "max" in v) {
        const nr = v as NumberRange;
        return nr.min !== "" || nr.max !== "";
    }
    return true;
}

/* ─── Condition Dispatcher ────────────────────────────────────────────── */

/**
 * Routes a single condition to the correct matcher based on field type.
 * Handles null/undefined raw values by coercing safely.
 */
function matchCondition(
    record: Record<string, unknown>,
    condition: FilterCondition,
    fieldDef: FieldDefinition
): boolean {
    const rawValue = getNestedValue(record, condition.fieldKey);

    switch (fieldDef.type) {
        case FieldType.Text:
            return matchText(
                String(rawValue ?? ""),
                condition.value as string,
                condition.operator
            );
        case FieldType.Number:
            return matchNumber(
                Number(rawValue),
                condition.value as number | NumberRange,
                condition.operator
            );
        case FieldType.Date:
            return matchDate(
                String(rawValue ?? ""),
                condition.value as DateRange,
                condition.operator
            );
        case FieldType.Amount:
            return matchAmountRange(Number(rawValue), condition.value as NumberRange);
        case FieldType.SingleSelect:
            return matchSingleSelect(
                String(rawValue ?? ""),
                condition.value as string,
                condition.operator
            );
        case FieldType.MultiSelect:
            return matchMultiSelect(
                Array.isArray(rawValue) ? (rawValue as string[]) : [],
                condition.value as string[],
                condition.operator
            );
        case FieldType.Boolean:
            return matchBoolean(rawValue, condition.value as boolean);
        default:
            return true;
    }
}

/* ─── Main Entry Point ────────────────────────────────────────────────── */

/**
 * Applies all valid filter conditions to the dataset.
 *
 * Algorithm:
 * 1. Drop incomplete conditions (`isValidFilter`).
 * 2. Build a Map<fieldKey, FieldDefinition> for O(1) lookups.
 * 3. Group conditions by fieldKey.
 * 4. For each record, apply **AND** logic between different fields and
 *    **OR** logic between conditions on the same field.
 *
 * Complexity: O(N × C) where N = dataset size, C = condition count.
 * The Map and grouping keep overhead minimal for 50–200 record datasets.
 */
export function applyFilters<T extends Record<string, unknown>>(
    data: T[],
    conditions: FilterCondition[],
    fieldDefinitions: FieldDefinition[]
): T[] {
    const validConditions = conditions.filter(isValidFilter);
    if (validConditions.length === 0) return data;

    // O(1) lookups during the filter pass
    const fieldMap = new Map(fieldDefinitions.map((fd) => [fd.key, fd]));

    // Group same-field conditions for OR logic
    const groupedByField = validConditions.reduce<Record<string, FilterCondition[]>>(
        (acc, condition) => {
            const key = condition.fieldKey;
            if (!acc[key]) acc[key] = [];
            acc[key].push(condition);
            return acc;
        },
        {}
    );

    return data.filter((record) => {
        // AND between field groups, OR within each group
        return Object.entries(groupedByField).every(([fieldKey, fieldConditions]) => {
            const fieldDef = fieldMap.get(fieldKey);
            if (!fieldDef) return true;
            return fieldConditions.some((condition) =>
                matchCondition(record as Record<string, unknown>, condition, fieldDef)
            );
        });
    });
}

/* ─── Default Value Factory ───────────────────────────────────────────── */

/** Returns a sensible initial value for a given field type. */
export function getDefaultValue(type: FieldType): FilterValue {
    switch (type) {
        case FieldType.Text:
            return "";
        case FieldType.Number:
            return 0;
        case FieldType.Date:
            return { start: "", end: "" };
        case FieldType.Amount:
            return { min: "", max: "" };
        case FieldType.SingleSelect:
            return "";
        case FieldType.MultiSelect:
            return [];
        case FieldType.Boolean:
            return true;
    }
}

/** Returns the appropriate default value for a specific operator. */
export function getDefaultValueForOperator(type: FieldType, operator: string): FilterValue {
    // Relative date operators don't need a value
    if (["last7days", "last30days", "last90days"].includes(operator)) {
        return { start: "", end: "" };
    }
    // Number between needs a range
    if (operator === "numberBetween") {
        return { min: "", max: "" };
    }
    return getDefaultValue(type);
}

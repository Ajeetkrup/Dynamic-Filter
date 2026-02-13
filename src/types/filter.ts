/**
 * Core type definitions for the dynamic filter system.
 *
 * This module defines the entire type hierarchy that powers the filter engine:
 * - FieldType: all supported data types (as a const object to satisfy erasableSyntaxOnly)
 * - Per-type operator unions: constrained operator sets per field type
 * - FilterCondition / FieldDefinition: the primary data shapes
 * - OPERATOR_LABELS / OPERATORS_BY_TYPE: UI and engine lookup tables
 */

/* ─── Field Types ─────────────────────────────────────────────────────── */

/**
 * Every data type a filterable field can have.
 * Uses `as const` pattern instead of `enum` to comply with erasableSyntaxOnly.
 */
export const FieldType = {
    Text: "text",
    Number: "number",
    Date: "date",
    Amount: "amount",
    SingleSelect: "singleSelect",
    MultiSelect: "multiSelect",
    Boolean: "boolean",
} as const;

/** Derive a union type from the FieldType values. */
export type FieldType = (typeof FieldType)[keyof typeof FieldType];

/* ─── Per-Type Operators ──────────────────────────────────────────────── */

export type TextOperator =
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "doesNotContain"
    | "regex";

export type NumberOperator = "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "numberBetween";

export type DateOperator = "between" | "before" | "after" | "last7days" | "last30days" | "last90days";

export type AmountOperator = "between";

export type SingleSelectOperator = "is" | "isNot";

export type MultiSelectOperator = "in" | "notIn" | "all";

export type BooleanOperator = "is";

/** Union of all operator types. */
export type Operator =
    | TextOperator
    | NumberOperator
    | DateOperator
    | AmountOperator
    | SingleSelectOperator
    | MultiSelectOperator
    | BooleanOperator;

/* ─── Value Shapes ────────────────────────────────────────────────────── */

export interface DateRange {
    start: string;
    end: string;
}

export interface NumberRange {
    min: number | "";
    max: number | "";
}

export type FilterValue =
    | string
    | number
    | boolean
    | string[]
    | DateRange
    | NumberRange;

/* ─── Domain Interfaces ───────────────────────────────────────────────── */

/** A single filter condition applied by the user. */
export interface FilterCondition {
    id: string;
    fieldKey: string;
    operator: Operator;
    value: FilterValue;
}

/** Option for select-based dropdowns. */
export interface SelectOption {
    label: string;
    value: string;
}

/** Describes a filterable field and its type, used by both UI and engine. */
export interface FieldDefinition {
    key: string;
    label: string;
    type: FieldType;
    options?: SelectOption[];
    /** If true, the key uses dot-notation to reach a nested value (e.g. "address.city"). */
    nested?: boolean;
}

/* ─── Lookup Tables ───────────────────────────────────────────────────── */

/** Human-readable labels for every operator, used in the FilterRow dropdown. */
export const OPERATOR_LABELS: Record<Operator, string> = {
    // Text
    equals: "Equals",
    contains: "Contains",
    startsWith: "Starts With",
    endsWith: "Ends With",
    doesNotContain: "Does Not Contain",
    regex: "Matches Regex",
    // Number
    eq: "Equals",
    neq: "Not Equal",
    gt: "Greater Than",
    lt: "Less Than",
    gte: "≥ Greater or Equal",
    lte: "≤ Less or Equal",
    numberBetween: "Between",
    // Date
    between: "Between",
    before: "Before",
    after: "After",
    last7days: "Last 7 Days",
    last30days: "Last 30 Days",
    last90days: "Last 90 Days",
    // Select
    is: "Is",
    isNot: "Is Not",
    in: "Contains Any",
    notIn: "Does Not Contain",
    all: "Contains All",
};

/**
 * Maps each FieldType to its valid operators.
 * The first entry in each array is the default for new filters.
 */
export const OPERATORS_BY_TYPE: Record<FieldType, Operator[]> = {
    [FieldType.Text]: ["equals", "contains", "startsWith", "endsWith", "doesNotContain", "regex"],
    [FieldType.Number]: ["eq", "neq", "gt", "lt", "gte", "lte", "numberBetween"],
    [FieldType.Date]: ["between", "before", "after", "last7days", "last30days", "last90days"],
    [FieldType.Amount]: ["between"],
    [FieldType.SingleSelect]: ["is", "isNot"],
    [FieldType.MultiSelect]: ["in", "notIn", "all"],
    [FieldType.Boolean]: ["is"],
};

/**
 * FilterRow: renders a single filter condition.
 *
 * Dynamically shows/hides the value input based on the selected operator:
 * - Relative date operators (last7/30/90 days) hide the value input entirely.
 * - "numberBetween" swaps the value input for a min/max range.
 * - "before"/"after" show a single DatePicker instead of two.
 * - All other operators show the standard type-specific input.
 *
 * When the user changes the field, the operator resets to the first valid
 * option and the value resets via getDefaultValueForOperator.
 */

import { Box, FormControl, Select, MenuItem, IconButton, Fade, Typography } from "@mui/material";
import { Trash2, CalendarClock } from "lucide-react";
import {
    FieldType,
    OPERATORS_BY_TYPE,
    OPERATOR_LABELS,
} from "../../types/filter";
import type {
    FilterCondition,
    FieldDefinition,
    Operator,
    FilterValue,
    DateRange,
    NumberRange,
} from "../../types/filter";
import { getDefaultValue, getDefaultValueForOperator } from "../../engine/filterEngine";
import TextInput from "./inputs/TextInput";
import NumberInput from "./inputs/NumberInput";
import DateRangeInput from "./inputs/DateRangeInput";
import AmountRangeInput from "./inputs/AmountRangeInput";
import SingleSelectInput from "./inputs/SingleSelectInput";
import MultiSelectInput from "./inputs/MultiSelectInput";
import BooleanInput from "./inputs/BooleanInput";
import SingleDateInput from "./inputs/SingleDateInput";

interface FilterRowProps {
    condition: FilterCondition;
    fields: FieldDefinition[];
    onUpdate: (id: string, patch: Partial<FilterCondition>) => void;
    onRemove: (id: string) => void;
}

/** Operators that don't require a user-provided value. */
const VALUELESS_OPERATORS = ["last7days", "last30days", "last90days"];

/**
 * Determines which value input to render based on field type + operator.
 * Returns null for operators that don't need a value (relative dates).
 */
function renderValueInput(
    fieldDef: FieldDefinition,
    value: FilterValue,
    operator: string,
    onChange: (v: FilterValue) => void
) {
    // Relative date operators show a label instead of an input
    if (VALUELESS_OPERATORS.includes(operator)) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, color: "text.secondary" }}>
                <CalendarClock size={14} />
                <Typography variant="body2" sx={{ fontStyle: "italic", opacity: 0.8 }}>
                    Auto-calculated from today
                </Typography>
            </Box>
        );
    }

    // "before" / "after" only need a single date, not a range
    if (operator === "before" || operator === "after") {
        return <SingleDateInput value={value as DateRange} operator={operator} onChange={onChange} />;
    }

    // Number "numberBetween" uses a min/max range input
    if (operator === "numberBetween") {
        return <AmountRangeInput value={value as NumberRange} onChange={onChange} />;
    }

    switch (fieldDef.type) {
        case FieldType.Text:
            return <TextInput value={value as string} onChange={onChange} />;
        case FieldType.Number:
            return <NumberInput value={value as number} onChange={onChange} />;
        case FieldType.Date:
            return <DateRangeInput value={value as DateRange} onChange={onChange} />;
        case FieldType.Amount:
            return <AmountRangeInput value={value as NumberRange} onChange={onChange} />;
        case FieldType.SingleSelect:
            return (
                <SingleSelectInput
                    value={value as string}
                    options={fieldDef.options ?? []}
                    onChange={onChange}
                />
            );
        case FieldType.MultiSelect:
            return (
                <MultiSelectInput
                    value={value as string[]}
                    options={fieldDef.options ?? []}
                    onChange={onChange}
                />
            );
        case FieldType.Boolean:
            return <BooleanInput value={value as boolean} onChange={onChange} />;
        default:
            return null;
    }
}

export default function FilterRow({
    condition,
    fields,
    onUpdate,
    onRemove,
}: FilterRowProps) {
    const selectedField = fields.find((f) => f.key === condition.fieldKey);
    const operators = selectedField ? OPERATORS_BY_TYPE[selectedField.type] : [];

    /** When field changes, reset operator to first valid + reset value. */
    const handleFieldChange = (fieldKey: string) => {
        const field = fields.find((f) => f.key === fieldKey);
        if (!field) return;
        const defaultOp = OPERATORS_BY_TYPE[field.type][0];
        onUpdate(condition.id, {
            fieldKey,
            operator: defaultOp,
            value: getDefaultValue(field.type),
        });
    };

    /** When operator changes, reset value to match the new operator's shape. */
    const handleOperatorChange = (operator: Operator) => {
        const field = selectedField;
        if (!field) return;
        onUpdate(condition.id, {
            operator,
            value: getDefaultValueForOperator(field.type, operator),
        });
    };

    const handleValueChange = (value: FilterValue) => {
        onUpdate(condition.id, { value });
    };

    return (
        <Fade in timeout={300}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(108, 99, 255, 0.03)",
                    border: "1px solid rgba(148, 163, 184, 0.06)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        backgroundColor: "rgba(108, 99, 255, 0.06)",
                        border: "1px solid rgba(108, 99, 255, 0.15)",
                    },
                }}
            >
                {/* Field selector */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <Select
                        value={condition.fieldKey}
                        onChange={(e) => handleFieldChange(e.target.value)}
                        displayEmpty
                        renderValue={(selected) => {
                            if (!selected) return <em style={{ opacity: 0.5 }}>Select field...</em>;
                            const f = fields.find((fd) => fd.key === selected);
                            return f?.label ?? selected;
                        }}
                    >
                        {fields.map((f) => (
                            <MenuItem key={f.key} value={f.key}>
                                {f.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Operator selector */}
                {selectedField && operators.length > 0 && (
                    <FormControl size="small" sx={{ minWidth: 170 }}>
                        <Select
                            value={condition.operator}
                            onChange={(e) => handleOperatorChange(e.target.value as Operator)}
                        >
                            {operators.map((op) => (
                                <MenuItem key={op} value={op}>
                                    {OPERATOR_LABELS[op]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {/* Value input (or label for valueless operators) */}
                {selectedField &&
                    renderValueInput(selectedField, condition.value, condition.operator, handleValueChange)}

                {/* Delete button */}
                <IconButton
                    onClick={() => onRemove(condition.id)}
                    size="small"
                    aria-label="Remove filter"
                    sx={{
                        ml: "auto",
                        color: "#94A3B8",
                        transition: "all 0.2s ease",
                        "&:hover": { color: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.1)" },
                    }}
                >
                    <Trash2 size={16} />
                </IconButton>
            </Box>
        </Fade>
    );
}

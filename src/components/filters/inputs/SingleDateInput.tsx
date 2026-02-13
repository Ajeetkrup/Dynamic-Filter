/**
 * SingleDateInput: used for "before" and "after" date operators.
 * Shows a single DatePicker with a contextual label based on the operator.
 */

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { DateRange } from "../../../types/filter";

interface SingleDateInputProps {
    value: DateRange;
    operator: string;
    onChange: (value: DateRange) => void;
}

export default function SingleDateInput({ value, operator, onChange }: SingleDateInputProps) {
    const label = operator === "before" ? "Before date" : "After date";
    const dateValue = operator === "before"
        ? (value.end || value.start)
        : (value.start || value.end);

    return (
        <DatePicker
            label={label}
            value={dateValue ? dayjs(dateValue) : null}
            onChange={(date: Dayjs | null) => {
                const formatted = date ? date.format("YYYY-MM-DD") : "";
                if (operator === "before") {
                    onChange({ start: "", end: formatted });
                } else {
                    onChange({ start: formatted, end: "" });
                }
            }}
            slotProps={{ textField: { size: "small", sx: { minWidth: 180 } } }}
        />
    );
}

/** Min/Max range input with currency adornment. Empty strings are treated as unbounded. */
import { Box, TextField, InputAdornment } from "@mui/material";
import type { NumberRange } from "../../../types/filter";

interface AmountRangeInputProps {
    value: NumberRange;
    onChange: (value: NumberRange) => void;
}

export default function AmountRangeInput({ value, onChange }: AmountRangeInputProps) {
    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
                size="small"
                type="number"
                placeholder="Min"
                value={value.min}
                onChange={(e) => {
                    const parsed = e.target.value === "" ? "" : parseFloat(e.target.value);
                    onChange({ ...value, min: parsed === "" || isNaN(parsed as number) ? "" : parsed });
                }}
                slotProps={{
                    input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    },
                    htmlInput: { step: "any" },
                }}
                sx={{ minWidth: 140 }}
            />
            <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>to</Box>
            <TextField
                size="small"
                type="number"
                placeholder="Max"
                value={value.max}
                onChange={(e) => {
                    const parsed = e.target.value === "" ? "" : parseFloat(e.target.value);
                    onChange({ ...value, max: parsed === "" || isNaN(parsed as number) ? "" : parsed });
                }}
                slotProps={{
                    input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    },
                    htmlInput: { step: "any" },
                }}
                sx={{ minWidth: 140 }}
            />
        </Box>
    );
}

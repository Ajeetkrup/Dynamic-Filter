/**
 * Multi-select dropdown with checkboxes.
 * Selected values render as chips inside the select. Supports "in", "notIn", and "all" operators.
 */
import {
    FormControl,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Box,
    Chip,
} from "@mui/material";
import type { SelectOption } from "../../../types/filter";

interface MultiSelectInputProps {
    value: string[];
    options: SelectOption[];
    onChange: (value: string[]) => void;
}

export default function MultiSelectInput({
    value,
    options,
    onChange,
}: MultiSelectInputProps) {
    return (
        <FormControl size="small" sx={{ minWidth: 260 }}>
            <Select
                multiple
                value={value}
                onChange={(e) => {
                    const v = e.target.value;
                    onChange(typeof v === "string" ? v.split(",") : v);
                }}
                displayEmpty
                renderValue={(selected) => {
                    if (selected.length === 0) {
                        return <em style={{ opacity: 0.5 }}>Select options...</em>;
                    }
                    return (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected.map((val) => {
                                const opt = options.find((o) => o.value === val);
                                return (
                                    <Chip
                                        key={val}
                                        label={opt?.label ?? val}
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontSize: "0.75rem",
                                            background: "rgba(108, 99, 255, 0.15)",
                                            color: "#9D97FF",
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    );
                }}
            >
                {options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                        <Checkbox
                            checked={value.includes(opt.value)}
                            size="small"
                            sx={{ color: "#6C63FF", "&.Mui-checked": { color: "#6C63FF" } }}
                        />
                        <ListItemText primary={opt.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

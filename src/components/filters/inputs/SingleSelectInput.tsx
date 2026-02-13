import { FormControl, Select, MenuItem } from "@mui/material";
import type { SelectOption } from "../../../types/filter";

interface SingleSelectInputProps {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
}

export default function SingleSelectInput({
    value,
    options,
    onChange,
}: SingleSelectInputProps) {
    return (
        <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                displayEmpty
                renderValue={(selected) => {
                    if (!selected) return <em style={{ opacity: 0.5 }}>Select option...</em>;
                    const opt = options.find((o) => o.value === selected);
                    return opt?.label ?? selected;
                }}
            >
                {options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

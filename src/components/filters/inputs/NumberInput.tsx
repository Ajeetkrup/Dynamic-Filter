/** Numeric input with NaN guard — invalid input coerces to 0 instead of propagating NaN. */
import { TextField } from "@mui/material";

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
}

export default function NumberInput({ value, onChange }: NumberInputProps) {
    return (
        <TextField
            size="small"
            type="number"
            placeholder="Enter number..."
            value={value}
            onChange={(e) => {
                const parsed = parseFloat(e.target.value);
                onChange(isNaN(parsed) ? 0 : parsed);
            }}
            sx={{ minWidth: 160 }}
            slotProps={{
                htmlInput: { step: "any" },
            }}
        />
    );
}

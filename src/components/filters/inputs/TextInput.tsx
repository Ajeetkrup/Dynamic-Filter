/** Simple text input with debounce-compatible onChange. Used for text field operators. */
import { TextField } from "@mui/material";

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TextInput({ value, onChange }: TextInputProps) {
    return (
        <TextField
            size="small"
            placeholder="Enter value..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{ minWidth: 200 }}
        />
    );
}

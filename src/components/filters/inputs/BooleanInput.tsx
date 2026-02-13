/** Toggle switch with True/False labels. Visual weight shifts to the active label. */
import { Box, Switch, Typography } from "@mui/material";

interface BooleanInputProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export default function BooleanInput({ value, onChange }: BooleanInputProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
                variant="body2"
                sx={{ opacity: !value ? 1 : 0.4, fontWeight: !value ? 600 : 400 }}
            >
                False
            </Typography>
            <Switch
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                sx={{
                    "& .MuiSwitch-thumb": {
                        backgroundColor: value ? "#6C63FF" : "#94A3B8",
                    },
                    "& .MuiSwitch-track": {
                        backgroundColor: value
                            ? "rgba(108, 99, 255, 0.3) !important"
                            : "rgba(148, 163, 184, 0.3) !important",
                    },
                }}
            />
            <Typography
                variant="body2"
                sx={{ opacity: value ? 1 : 0.4, fontWeight: value ? 600 : 400 }}
            >
                True
            </Typography>
        </Box>
    );
}

import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import type { DateRange } from "../../../types/filter";

interface DateRangeInputProps {
    value: DateRange;
    onChange: (value: DateRange) => void;
}

export default function DateRangeInput({ value, onChange }: DateRangeInputProps) {
    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <DatePicker
                label="Start"
                value={value.start ? dayjs(value.start) : null}
                onChange={(date: Dayjs | null) =>
                    onChange({ ...value, start: date ? date.format("YYYY-MM-DD") : "" })
                }
                slotProps={{ textField: { size: "small", sx: { minWidth: 150 } } }}
            />
            <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>to</Box>
            <DatePicker
                label="End"
                value={value.end ? dayjs(value.end) : null}
                onChange={(date: Dayjs | null) =>
                    onChange({ ...value, end: date ? date.format("YYYY-MM-DD") : "" })
                }
                slotProps={{ textField: { size: "small", sx: { minWidth: 150 } } }}
            />
        </Box>
    );
}

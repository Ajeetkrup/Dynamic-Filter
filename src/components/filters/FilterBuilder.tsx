import { Box, Button, Paper, Typography, Chip } from "@mui/material";
import { Plus, X, Filter } from "lucide-react";
import type { FilterCondition } from "../../types/filter";
import type { FieldDefinition } from "../../types/filter";
import FilterRow from "./FilterRow";

interface FilterBuilderProps {
    conditions: FilterCondition[];
    fields: FieldDefinition[];
    onAdd: () => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, patch: Partial<FilterCondition>) => void;
    onClear: () => void;
    activeFilterCount: number;
}

export default function FilterBuilder({
    conditions,
    fields,
    onAdd,
    onRemove,
    onUpdate,
    onClear,
    activeFilterCount,
}: FilterBuilderProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(145deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)",
                backdropFilter: "blur(20px)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2.5,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(135deg, rgba(108, 99, 255, 0.2) 0%, rgba(157, 151, 255, 0.1) 100%)",
                        }}
                    >
                        <Filter size={18} color="#6C63FF" />
                    </Box>
                    <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
                        Filters
                    </Typography>
                    {activeFilterCount > 0 && (
                        <Chip
                            label={`${activeFilterCount} active`}
                            size="small"
                            sx={{
                                height: 24,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                background: "linear-gradient(135deg, rgba(108, 99, 255, 0.2) 0%, rgba(157, 151, 255, 0.15) 100%)",
                                color: "#9D97FF",
                                border: "1px solid rgba(108, 99, 255, 0.2)",
                            }}
                        />
                    )}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    {conditions.length > 0 && (
                        <Button
                            size="small"
                            onClick={onClear}
                            startIcon={<X size={14} />}
                            sx={{
                                color: "#94A3B8",
                                "&:hover": { color: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.08)" },
                            }}
                        >
                            Clear All
                        </Button>
                    )}
                    <Button
                        size="small"
                        variant="contained"
                        onClick={onAdd}
                        startIcon={<Plus size={14} />}
                    >
                        Add Filter
                    </Button>
                </Box>
            </Box>

            {conditions.length === 0 ? (
                <Box
                    sx={{
                        py: 4,
                        textAlign: "center",
                        color: "text.secondary",
                        borderRadius: 2,
                        border: "1px dashed rgba(148, 163, 184, 0.15)",
                    }}
                >
                    <Filter size={32} strokeWidth={1} style={{ marginBottom: 8, opacity: 0.3 }} />
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        No filters applied. Click "Add Filter" to get started.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {conditions.map((condition, index) => (
                        <Box key={condition.id}>
                            {index > 0 && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        my: 0.5,
                                        ml: 2,
                                    }}
                                >
                                    <Chip
                                        label={
                                            index > 0 &&
                                                conditions[index - 1]?.fieldKey === condition.fieldKey &&
                                                condition.fieldKey !== ""
                                                ? "OR"
                                                : "AND"
                                        }
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: "0.65rem",
                                            fontWeight: 700,
                                            letterSpacing: "0.05em",
                                            backgroundColor:
                                                index > 0 &&
                                                    conditions[index - 1]?.fieldKey === condition.fieldKey &&
                                                    condition.fieldKey !== ""
                                                    ? "rgba(245, 158, 11, 0.15)"
                                                    : "rgba(16, 185, 129, 0.15)",
                                            color:
                                                index > 0 &&
                                                    conditions[index - 1]?.fieldKey === condition.fieldKey &&
                                                    condition.fieldKey !== ""
                                                    ? "#F59E0B"
                                                    : "#10B981",
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            flex: 1,
                                            height: "1px",
                                            backgroundColor: "rgba(148, 163, 184, 0.08)",
                                        }}
                                    />
                                </Box>
                            )}
                            <FilterRow
                                condition={condition}
                                fields={fields}
                                onUpdate={onUpdate}
                                onRemove={onRemove}
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
}

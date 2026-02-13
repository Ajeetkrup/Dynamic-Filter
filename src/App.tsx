import { useMemo } from "react";
import { Box, Typography, Container, CircularProgress, Alert } from "@mui/material";
import { useEmployees } from "./hooks/useEmployees";
import { useFilters } from "./hooks/useFilters";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { applyFilters } from "./engine/filterEngine";
import { FILTER_FIELDS } from "./config/filterFields";
import FilterBuilder from "./components/filters/FilterBuilder";
import DataTable from "./components/table/DataTable";
import ExportMenu from "./components/export/ExportMenu";
import type { Employee } from "./types/employee";

export default function App() {
  const { employees, loading, error } = useEmployees();
  const { conditions, addFilter, removeFilter, updateFilter, clearFilters } =
    useFilters();

  const debouncedConditions = useDebouncedValue(conditions, 250);

  const filteredData = useMemo(
    () =>
      applyFilters(
        employees as unknown as Record<string, unknown>[],
        debouncedConditions,
        FILTER_FIELDS
      ) as unknown as Employee[],
    [employees, debouncedConditions]
  );

  const activeFilterCount = useMemo(
    () =>
      debouncedConditions.filter(
        (c) => c.fieldKey && c.operator && c.value !== "" && c.value !== undefined
      ).length,
    [debouncedConditions]
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={28} sx={{ color: "#6C63FF" }} />
        <Typography sx={{ color: "text.secondary" }}>Loading employees...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          Failed to load data: {error}. Make sure json-server is running on port 3001.
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, rgba(108, 99, 255, 0.08) 0%, #0A0E1A 60%)",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                background: "linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0.5,
              }}
            >
              Employee Directory
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              Dynamic filter system with real-time data updates
            </Typography>
          </Box>
          <ExportMenu data={filteredData} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FilterBuilder
            conditions={conditions}
            fields={FILTER_FIELDS}
            onAdd={addFilter}
            onRemove={removeFilter}
            onUpdate={updateFilter}
            onClear={clearFilters}
            activeFilterCount={activeFilterCount}
          />
        </Box>

        <DataTable data={filteredData} totalCount={employees.length} />
      </Container>
    </Box>
  );
}

import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Chip,
    TableSortLabel,
} from "@mui/material";
import dayjs from "dayjs";
import type { Employee } from "../../types/employee";
import NoResults from "./NoResults";

type SortDirection = "asc" | "desc";

interface ColumnDef {
    key: string;
    label: string;
    sortable: boolean;
    render?: (employee: Employee) => React.ReactNode;
    width?: number;
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split(".").reduce<unknown>((acc, key) => {
        if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj);
}

const columns: ColumnDef[] = [
    { key: "id", label: "ID", sortable: true, width: 60 },
    { key: "name", label: "Name", sortable: true, width: 160 },
    { key: "email", label: "Email", sortable: true, width: 220 },
    { key: "department", label: "Department", sortable: true, width: 130 },
    { key: "role", label: "Role", sortable: true, width: 160 },
    {
        key: "salary",
        label: "Salary",
        sortable: true,
        width: 110,
        render: (e) => `$${e.salary.toLocaleString()}`,
    },
    {
        key: "joinDate",
        label: "Join Date",
        sortable: true,
        width: 110,
        render: (e) => dayjs(e.joinDate).format("MMM D, YYYY"),
    },
    {
        key: "isActive",
        label: "Active",
        sortable: true,
        width: 90,
        render: (e) => (
            <Chip
                label={e.isActive ? "Active" : "Inactive"}
                size="small"
                sx={{
                    height: 24,
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    backgroundColor: e.isActive
                        ? "rgba(16, 185, 129, 0.12)"
                        : "rgba(239, 68, 68, 0.12)",
                    color: e.isActive ? "#10B981" : "#EF4444",
                    border: `1px solid ${e.isActive ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                }}
            />
        ),
    },
    {
        key: "skills",
        label: "Skills",
        sortable: false,
        width: 260,
        render: (e) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {e.skills.slice(0, 3).map((skill) => (
                    <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{
                            height: 22,
                            fontSize: "0.68rem",
                            fontWeight: 500,
                            backgroundColor: "rgba(108, 99, 255, 0.1)",
                            color: "#9D97FF",
                        }}
                    />
                ))}
                {e.skills.length > 3 && (
                    <Chip
                        label={`+${e.skills.length - 3}`}
                        size="small"
                        sx={{
                            height: 22,
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            backgroundColor: "rgba(148, 163, 184, 0.1)",
                            color: "#94A3B8",
                        }}
                    />
                )}
            </Box>
        ),
    },
    {
        key: "address.city",
        label: "City",
        sortable: true,
        width: 130,
        render: (e) => e.address.city,
    },
    {
        key: "address.country",
        label: "Country",
        sortable: true,
        width: 100,
        render: (e) => e.address.country,
    },
    { key: "projects", label: "Projects", sortable: true, width: 90 },
    {
        key: "lastReview",
        label: "Last Review",
        sortable: true,
        width: 120,
        render: (e) => dayjs(e.lastReview).format("MMM D, YYYY"),
    },
    {
        key: "performanceRating",
        label: "Rating",
        sortable: true,
        width: 90,
        render: (e) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor:
                            e.performanceRating >= 4.5
                                ? "#10B981"
                                : e.performanceRating >= 3.5
                                    ? "#F59E0B"
                                    : "#EF4444",
                    }}
                />
                {e.performanceRating.toFixed(1)}
            </Box>
        ),
    },
];

interface DataTableProps {
    data: Employee[];
    totalCount: number;
}

export default function DataTable({ data, totalCount }: DataTableProps) {
    const [sortKey, setSortKey] = useState<string>("id");
    const [sortDir, setSortDir] = useState<SortDirection>("asc");

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const sorted = useMemo(() => {
        return [...data].sort((a, b) => {
            const aVal = getNestedValue(a as unknown as Record<string, unknown>, sortKey);
            const bVal = getNestedValue(b as unknown as Record<string, unknown>, sortKey);

            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            let comparison = 0;
            if (typeof aVal === "string" && typeof bVal === "string") {
                comparison = aVal.localeCompare(bVal);
            } else if (typeof aVal === "number" && typeof bVal === "number") {
                comparison = aVal - bVal;
            } else if (typeof aVal === "boolean" && typeof bVal === "boolean") {
                comparison = Number(aVal) - Number(bVal);
            } else {
                comparison = String(aVal).localeCompare(String(bVal));
            }

            return sortDir === "asc" ? comparison : -comparison;
        });
    }, [data, sortKey, sortDir]);

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: "linear-gradient(145deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 100%)",
                backdropFilter: "blur(20px)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
                }}
            >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Showing{" "}
                    <Box component="span" sx={{ color: "#6C63FF", fontWeight: 700 }}>
                        {data.length}
                    </Box>{" "}
                    of{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                        {totalCount}
                    </Box>{" "}
                    records
                </Typography>
            </Box>

            {data.length === 0 ? (
                <NoResults />
            ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        sx={{
                                            width: col.width,
                                            backgroundColor: "rgba(10, 14, 26, 0.95)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {col.sortable ? (
                                            <TableSortLabel
                                                active={sortKey === col.key}
                                                direction={sortKey === col.key ? sortDir : "asc"}
                                                onClick={() => handleSort(col.key)}
                                                sx={{
                                                    "&.MuiTableSortLabel-root": { color: "#94A3B8" },
                                                    "&.MuiTableSortLabel-root.Mui-active": { color: "#6C63FF" },
                                                    "& .MuiTableSortLabel-icon": { color: "#6C63FF !important" },
                                                }}
                                            >
                                                {col.label}
                                            </TableSortLabel>
                                        ) : (
                                            col.label
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sorted.map((employee) => (
                                <TableRow key={employee.id} hover>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            sx={{ whiteSpace: "nowrap", fontSize: "0.835rem" }}
                                        >
                                            {col.render
                                                ? col.render(employee)
                                                : String(
                                                    getNestedValue(
                                                        employee as unknown as Record<string, unknown>,
                                                        col.key
                                                    ) ?? ""
                                                )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}

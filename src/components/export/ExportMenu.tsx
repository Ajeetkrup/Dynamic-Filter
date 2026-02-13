import { useState } from "react";
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { Download, FileSpreadsheet, FileJson } from "lucide-react";
import type { Employee } from "../../types/employee";
import { exportToCSV, exportToJSON } from "../../utils/export";

interface ExportMenuProps {
    data: Employee[];
}

export default function ExportMenu({ data }: ExportMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <Button
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                startIcon={<Download size={14} />}
                disabled={data.length === 0}
                sx={{
                    color: "#94A3B8",
                    borderColor: "rgba(148, 163, 184, 0.2)",
                    "&:hover": {
                        backgroundColor: "rgba(108, 99, 255, 0.08)",
                        color: "#9D97FF",
                    },
                }}
                variant="outlined"
            >
                Export
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: "#1E293B",
                            border: "1px solid rgba(148, 163, 184, 0.1)",
                            borderRadius: 2,
                            minWidth: 180,
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        exportToCSV(data as unknown as Record<string, unknown>[], "employees");
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <FileSpreadsheet size={16} color="#10B981" />
                    </ListItemIcon>
                    <ListItemText>Export as CSV</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        exportToJSON(data, "employees");
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <FileJson size={16} color="#6C63FF" />
                    </ListItemIcon>
                    <ListItemText>Export as JSON</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}

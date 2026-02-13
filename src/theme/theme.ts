import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#6C63FF",
            light: "#9D97FF",
            dark: "#4B44CC",
        },
        secondary: {
            main: "#FF6B9D",
            light: "#FF9BC1",
            dark: "#CC4B7A",
        },
        background: {
            default: "#0A0E1A",
            paper: "#111827",
        },
        text: {
            primary: "#F1F5F9",
            secondary: "#94A3B8",
        },
        error: {
            main: "#EF4444",
        },
        success: {
            main: "#10B981",
        },
        warning: {
            main: "#F59E0B",
        },
        divider: "rgba(148, 163, 184, 0.12)",
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', sans-serif",
        h4: {
            fontWeight: 700,
            letterSpacing: "-0.02em",
        },
        h6: {
            fontWeight: 600,
            letterSpacing: "-0.01em",
        },
        body2: {
            color: "#94A3B8",
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    border: "1px solid rgba(148, 163, 184, 0.08)",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 10,
                    padding: "8px 20px",
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #6C63FF 0%, #9D97FF 100%)",
                    boxShadow: "0 4px 14px rgba(108, 99, 255, 0.35)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #5B54E6 0%, #8B85F0 100%)",
                        boxShadow: "0 6px 20px rgba(108, 99, 255, 0.5)",
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
                },
                head: {
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#94A3B8",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(148, 163, 184, 0.15)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(108, 99, 255, 0.4)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6C63FF",
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        backgroundColor: "rgba(108, 99, 255, 0.04) !important",
                    },
                },
            },
        },
    },
});

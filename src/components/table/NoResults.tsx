import { Box, Typography } from "@mui/material";
import { SearchX } from "lucide-react";

export default function NoResults() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                color: "text.secondary",
            }}
        >
            <Box
                sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(108, 99, 255, 0.08)",
                    mb: 2,
                }}
            >
                <SearchX size={32} strokeWidth={1.5} color="#6C63FF" />
            </Box>
            <Typography variant="h6" sx={{ mb: 0.5, color: "text.primary" }}>
                No results found
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
                Try adjusting your filters to find what you're looking for.
            </Typography>
        </Box>
    );
}

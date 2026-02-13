export function exportToCSV<T extends Record<string, unknown>>(
    data: T[],
    filename: string
): void {
    if (data.length === 0) return;

    const flattenObject = (
        obj: Record<string, unknown>,
        prefix = ""
    ): Record<string, string> => {
        const result: Record<string, string> = {};
        for (const [key, value] of Object.entries(obj)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (value && typeof value === "object" && !Array.isArray(value)) {
                Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
            } else if (Array.isArray(value)) {
                result[newKey] = value.join("; ");
            } else {
                result[newKey] = String(value ?? "");
            }
        }
        return result;
    };

    const flattened = data.map((row) => flattenObject(row));
    const headers = Object.keys(flattened[0]);
    const csvRows = [
        headers.join(","),
        ...flattened.map((row) =>
            headers
                .map((h) => {
                    const cell = row[h] ?? "";
                    return cell.includes(",") || cell.includes('"')
                        ? `"${cell.replace(/"/g, '""')}"`
                        : cell;
                })
                .join(",")
        ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${filename}.csv`);
}

export function exportToJSON<T>(data: T[], filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    downloadBlob(blob, `${filename}.json`);
}

function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

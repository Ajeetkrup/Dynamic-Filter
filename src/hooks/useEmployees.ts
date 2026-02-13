import { useState, useEffect } from "react";
import type { Employee } from "../types/employee";
import { fetchEmployees } from "../api/employeeApi";

export function useEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchEmployees()
            .then((data) => {
                if (!cancelled) {
                    setEmployees(data);
                    setError(null);
                }
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return { employees, loading, error };
}

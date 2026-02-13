import type { Employee } from "../types/employee";

const API_URL = "http://localhost:3001";

export async function fetchEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_URL}/employees`);
    if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.statusText}`);
    }
    return response.json();
}

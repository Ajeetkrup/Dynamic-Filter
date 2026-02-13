# Dynamic Filter Component System

A production-ready, type-safe dynamic filter system built with **React 18**, **TypeScript**, **Vite**, and **Material UI**. Supports 7 field types, 25+ operators, real-time client-side filtering, localStorage persistence, and CSV/JSON export.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the mock API server (port 3001)
npx json-server src/data/employees.json --port 3001

# 3. In a separate terminal, start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── api/
│   └── employeeApi.ts          # Fetch wrapper for json-server
├── components/
│   ├── filters/
│   │   ├── FilterBuilder.tsx    # Main filter container (add/remove/clear)
│   │   ├── FilterRow.tsx        # Single filter condition row
│   │   └── inputs/              # 8 type-specific input components
│   │       ├── TextInput.tsx
│   │       ├── NumberInput.tsx
│   │       ├── DateRangeInput.tsx
│   │       ├── SingleDateInput.tsx
│   │       ├── AmountRangeInput.tsx
│   │       ├── SingleSelectInput.tsx
│   │       ├── MultiSelectInput.tsx
│   │       └── BooleanInput.tsx
│   ├── table/
│   │   ├── DataTable.tsx        # Sortable table with record counts
│   │   └── NoResults.tsx        # Empty state component
│   └── export/
│       └── ExportMenu.tsx       # CSV/JSON download menu
├── config/
│   └── filterFields.ts          # Field definitions & select options
├── data/
│   └── employees.json           # 55 employee records
├── engine/
│   └── filterEngine.ts          # Pure filtering logic (AND/OR, 7 types)
├── hooks/
│   ├── useFilters.ts            # Filter state + localStorage persistence
│   ├── useEmployees.ts          # Data fetching with error handling
│   └── useDebouncedValue.ts     # Generic debounce hook
├── theme/
│   └── theme.ts                 # Custom dark Material UI theme
├── types/
│   ├── employee.ts              # Employee interface
│   └── filter.ts                # All filter type definitions
├── utils/
│   ├── export.ts                # CSV/JSON export with nested object flattening
│   └── persistence.ts           # localStorage save/load utilities
├── App.tsx                      # Main application shell
├── main.tsx                     # Entry point with providers
└── index.css                    # Global styles
```

---

## 🔧 Supported Filter Types & Operators

| Field Type      | Operators                                                        |
|-----------------|------------------------------------------------------------------|
| **Text**        | Equals, Contains, Starts With, Ends With, Does Not Contain, **Regex** |
| **Number**      | Equals, Not Equal, >, <, ≥, ≤, **Between**                      |
| **Date**        | Between, Before, After, **Last 7/30/90 Days**                    |
| **Amount**      | Between (min/max range)                                          |
| **SingleSelect**| Is, Is Not                                                       |
| **MultiSelect** | Contains Any, Does Not Contain, **Contains All**                 |
| **Boolean**     | Is (True / False toggle)                                         |

---

## 🏗️ Architecture & Design Decisions

### Filter Engine Algorithm
- **AND logic** between different fields: all field groups must match
- **OR logic** within the same field: at least one condition per group must match
- Uses `Map<fieldKey, FieldDefinition>` for O(1) lookups during filter passes
- Complexity: O(N × C) where N = records, C = conditions
- `useMemo` prevents re-filtering on unrelated renders

### State Management
- `useFilters` hook manages CRUD operations on filter conditions
- State persists to `localStorage` automatically
- `useDebouncedValue(conditions, 250)` prevents excessive re-renders during typing

### Component Hierarchy

```
App
├── FilterBuilder
│   └── FilterRow (×N)
│       ├── Field Select
│       ├── Operator Select (dynamic per field type)
│       └── Value Input (dynamic per field type + operator)
├── DataTable
│   └── NoResults (conditional)
└── ExportMenu
```

### Type Safety
- All types derived from a central `filter.ts` module
- `FieldType` uses `as const` pattern (compatible with `erasableSyntaxOnly`)
- Type-only imports (`import type`) throughout for clean module boundaries
- Operator unions enforce that only valid operators can be assigned per field

---

## 🧩 Component Usage Examples

### Adding the FilterBuilder

```tsx
import FilterBuilder from "./components/filters/FilterBuilder";
import { useFilters } from "./hooks/useFilters";
import { FILTER_FIELDS } from "./config/filterFields";

function MyPage() {
  const { conditions, addFilter, removeFilter, updateFilter, clearFilters } = useFilters();

  return (
    <FilterBuilder
      conditions={conditions}
      fields={FILTER_FIELDS}
      onAdd={addFilter}
      onRemove={removeFilter}
      onUpdate={updateFilter}
      onClear={clearFilters}
      activeFilterCount={conditions.filter(c => c.fieldKey && c.operator).length}
    />
  );
}
```

### Applying Filters to Data

```tsx
import { applyFilters } from "./engine/filterEngine";
import { FILTER_FIELDS } from "./config/filterFields";

const filteredData = useMemo(
  () => applyFilters(data, conditions, FILTER_FIELDS),
  [data, conditions]
);
```

### Defining Custom Fields

```tsx
import { FieldType } from "./types/filter";
import type { FieldDefinition } from "./types/filter";

const MY_FIELDS: FieldDefinition[] = [
  { key: "name", label: "Name", type: FieldType.Text },
  { key: "age", label: "Age", type: FieldType.Number },
  {
    key: "status",
    label: "Status",
    type: FieldType.SingleSelect,
    options: [
      { label: "Active", value: "active" },
      { label: "Paused", value: "paused" },
    ],
  },
  { key: "address.city", label: "City", type: FieldType.Text, nested: true },
];
```

### Exporting Data

```tsx
import { exportToCSV, exportToJSON } from "./utils/export";

// Export filtered results
exportToCSV(filteredData, "employees-export");
exportToJSON(filteredData, "employees-export");
```

---

## ⚡ Performance Considerations

- **Memoized filtering**: `useMemo` recalculates only when data or conditions change
- **Debounced input**: 250ms debounce prevents re-filtering on every keystroke
- **Map-based lookups**: O(1) field definition access during filter passes
- **Lazy validation**: incomplete filter rows silently skip evaluation
- **Early termination**: empty condition arrays return data immediately without iteration

---

## 🛡️ Edge Case Handling

- **Null / undefined values**: coerced safely via `String(rawValue ?? "")` and `Number(rawValue)`
- **NaN numbers**: `Number.isNaN()` guard returns `false` instead of crashing
- **Invalid dates**: `dayjs.isValid()` check prevents bad comparisons
- **Empty arrays**: multi-select with 0 selections treated as "no filter applied"
- **Invalid regex**: `try/catch` wraps `new RegExp()` so bad patterns fail  gracefully
- **Non-array data**: multi-select matcher checks `Array.isArray()` before iterating

---

## 📦 Dataset

The bundled `employees.json` contains **55 diverse records** with:
- Text fields: `name`, `email`
- Numeric fields: `salary`, `projects`, `performanceRating`
- Date fields: `joinDate`, `lastReview`
- Boolean field: `isActive`
- Array field: `skills` (2–5 items per employee)
- Nested object: `address` with `city`, `state`, `country`
- Selection fields: `department` (8 values), `role` (15 values)

---

## 🔗 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 7.x | Build tool & dev server |
| Material UI | 7.x | Component library |
| MUI X Date Pickers | 8.x | Date selection |
| Day.js | 1.x | Date manipulation |
| Lucide React | 0.x | Icons |
| json-server | latest | Mock REST API |


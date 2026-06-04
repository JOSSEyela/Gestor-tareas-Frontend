import { useEffect, useMemo, useRef, useState } from "react";
import type { Priority, Status, Task, TaskFilters } from "../types";
import { defaultFilters, getUniqueTags } from "../utils/filterTasks";

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  tasks: Task[];
}

const PRIORITY_OPTIONS: { value: Priority | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];

const STATUS_OPTIONS: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "todo", label: "Por hacer" },
  { value: "in_progress", label: "En progreso" },
  { value: "done", label: "Completado" },
];

const selectClass =
  "rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 w-full md:w-auto";

export function FilterBar({ filters, onChange, tasks }: FilterBarProps) {
  const [searchLocal, setSearchLocal] = useState(filters.search);
  const filtersRef = useRef(filters);


  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);


  useEffect(() => {
    setSearchLocal(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchLocal !== filtersRef.current.search) {
        onChange({ ...filtersRef.current, search: searchLocal });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchLocal, onChange]);

  const uniqueTags = useMemo(() => getUniqueTags(tasks), [tasks]);

  const isFiltered =
    searchLocal !== "" ||
    filters.priority !== "all" ||
    filters.status !== "all" ||
    filters.tag !== "all";

  const handleClear = () => {
    setSearchLocal("");
    onChange(defaultFilters);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">

      <div className="relative flex-1 min-w-[200px]">
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          value={searchLocal}
          onChange={(e) => setSearchLocal(e.target.value)}
          placeholder="Buscar tareas..."
          className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2"
          style={{
            backgroundColor: "var(--color-bg-primary)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        />
      </div>


      <select
        value={filters.priority}
        onChange={(e) =>
          onChange({
            ...filters,
            priority: e.target.value as Priority | "all",
          })
        }
        className={selectClass}
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-primary)",
        }}
        aria-label="Filtrar por prioridad"
      >
        {PRIORITY_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>


      <select
        value={filters.status}
        onChange={(e) =>
          onChange({
            ...filters,
            status: e.target.value as Status | "all",
          })
        }
        className={selectClass}
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-primary)",
        }}
        aria-label="Filtrar por estado"
      >
        {STATUS_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>


      <select
        value={filters.tag}
        onChange={(e) => onChange({ ...filters, tag: e.target.value })}
        className={selectClass}
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-primary)",
        }}
        aria-label="Filtrar por etiqueta"
      >
        <option value="all">Todas las etiquetas</option>
        {uniqueTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>


      {isFiltered && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-70 w-full md:w-auto"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

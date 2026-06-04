import { useCallback, useState } from "react";
import type { TaskFilters } from "../types";
import { useTaskStore } from "../store/useTaskStore";
import { defaultFilters } from "../utils/filterTasks";
import { FilterBar } from "./FilterBar";
import { TaskBoard } from "./TaskBoard";

export function Dashboard() {
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const tasks = useTaskStore((s) => s.tasks);

  const handleFiltersChange = useCallback(
    (newFilters: TaskFilters) => setFilters(newFilters),
    [],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <FilterBar filters={filters} onChange={handleFiltersChange} tasks={tasks} />
      <TaskBoard filters={filters} />
    </div>
  );
}

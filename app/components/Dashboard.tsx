import { useState } from "react";
import type { TaskFilters } from "../types";
import { defaultFilters } from "../utils/filterTasks";
import { FilterBar } from "./FilterBar";
import { TaskBoard } from "./TaskBoard";

export function Dashboard() {
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);

  return (
    <div className="flex flex-col gap-4 p-4">
      <FilterBar filters={filters} onChange={setFilters} />
      <TaskBoard filters={filters} />
    </div>
  );
}

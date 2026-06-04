import { useMemo } from "react";
import type { Status, TaskFilters } from "../types";
import { useTaskStore } from "../store/useTaskStore";
import { filterTasks } from "../utils/filterTasks";
import { TaskCard } from "./TaskCard";

interface TaskBoardProps {
  filters: TaskFilters;
}

interface Column {
  status: Status;
  label: string;
  headerColor: string;
}

const COLUMNS: Column[] = [
  {
    status: "todo",
    label: "Por hacer",
    headerColor: "text-blue-500 dark:text-blue-400",
  },
  {
    status: "in_progress",
    label: "En progreso",
    headerColor: "text-amber-500 dark:text-amber-400",
  },
  {
    status: "done",
    label: "Completado",
    headerColor: "text-green-600 dark:text-green-400",
  },
];

const NEXT_LABEL: Partial<Record<Status, string>> = {
  todo: "En progreso",
  in_progress: "Completado",
};

const NEXT_STATUS: Partial<Record<Status, Status>> = {
  todo: "in_progress",
  in_progress: "done",
};

export function TaskBoard({ filters }: TaskBoardProps) {
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);

  const filtered = useMemo(
    () => filterTasks(tasks, filters),
    [tasks, filters],
  );

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {COLUMNS.map(({ status, label, headerColor }) => {
        const columnTasks = filtered.filter((t) => t.status === status);
        const nextStatus = NEXT_STATUS[status] ?? null;
        const nextLabel = NEXT_LABEL[status] ?? null;

        return (
          <section
            key={status}
            className="flex flex-1 flex-col gap-3 rounded-xl border p-4"
            style={{
              backgroundColor: "var(--color-bg-surface)",
              borderColor: "var(--color-border)",
              minHeight: "200px",
            }}
          >
            {/* Column header */}
            <header className="flex items-center gap-2">
              <h2 className={`text-sm font-semibold ${headerColor}`}>
                {label}
              </h2>
              <span
                className="rounded-full px-1.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: "var(--color-bg-primary)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {columnTasks.length}
              </span>
            </header>

            {/* Cards */}
            <div className="flex flex-col gap-3">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <div key={task.id} className="flex flex-col gap-1">
                    <TaskCard taskId={task.id} />
                    {nextStatus !== null && nextLabel !== null && (
                      <button
                        type="button"
                        onClick={() => void moveTask(task.id, nextStatus)}
                        className="w-full rounded-lg py-1 text-xs opacity-40 transition-opacity hover:opacity-80"
                        style={{ color: "var(--color-accent)" }}
                      >
                        Mover a {nextLabel} →
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p
                  className="py-10 text-center text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Sin tareas
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

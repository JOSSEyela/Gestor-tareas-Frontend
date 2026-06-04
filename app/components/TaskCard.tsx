import { useNavigate } from "react-router";
import type { Priority } from "../types";
import { useTaskStore } from "../store/useTaskStore";

interface TaskCardProps {
  taskId: string;
}

interface PriorityStyle {
  label: string;
  className: string;
}

const priorityStyles: Record<Priority, PriorityStyle> = {
  high: {
    label: "Alta",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  medium: {
    label: "Media",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  low: {
    label: "Baja",
    className:
      "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400",
  },
};

function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TaskCard({ taskId }: TaskCardProps) {
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === taskId));
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const navigate = useNavigate();

  if (!task) return null;

  const { title, description, priority, dueDate, tags } = task;
  const badge = priorityStyles[priority];

  return (
    <article
      className="relative flex flex-col gap-3 rounded-xl border p-4 transition-shadow duration-200 hover:shadow-md"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        borderColor: "var(--color-border)",
      }}
    >

      <span
        className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-semibold ${badge.className}`}
      >
        {badge.label}
      </span>


      <h3
        className="line-clamp-2 pr-14 text-sm font-bold leading-snug"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h3>


      <p
        className="line-clamp-3 text-xs leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {description}
      </p>


      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-2 py-0.5 text-xs"
              style={{
                backgroundColor: "var(--color-bg-primary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        {dueDate !== null ? (
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatDueDate(dueDate)}
          </span>
        ) : (
          <span />
        )}


        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate(`/task/${taskId}`)}
            className="rounded-md px-2 py-1 text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--color-accent)" }}
            aria-label={`Editar tarea: ${title}`}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => {
              void deleteTask(taskId);
            }}
            className="rounded-md px-2 py-1 text-xs font-medium text-red-500 transition-opacity hover:opacity-70 dark:text-red-400"
            aria-label={`Eliminar tarea: ${title}`}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}

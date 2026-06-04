import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import type { Priority, Status } from "../types";
import { useTaskStore } from "../store/useTaskStore";

interface TaskFormProps {
  taskId?: string;
}

interface FormFields {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  tags: string[];
}

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "todo", label: "Por hacer" },
  { value: "in_progress", label: "En progreso" },
  { value: "done", label: "Completado" },
];

const inputBase =
  "w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2";

export function TaskForm({ taskId }: TaskFormProps) {
  const task = useTaskStore((s) =>
    taskId ? s.tasks.find((t) => t.id === taskId) : undefined,
  );
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const userId = useTaskStore((s) => s.userId);
  const navigate = useNavigate();

  const [fields, setFields] = useState<FormFields>({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "medium",
    status: task?.status ?? "todo",
    dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
    tags: task?.tags ?? [],
  });
  const [tagInput, setTagInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof FormFields>(key: K, value: FormFields[K]) =>
    setFields((f) => ({ ...f, [key]: value }));

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !fields.tags.includes(tag)) {
      update("tags", [...fields.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    update(
      "tags",
      fields.tags.filter((t) => t !== tag),
    );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (!fields.title.trim()) return;

    setIsSubmitting(true);
    try {
      const input = {
        title: fields.title.trim(),
        description: fields.description.trim(),
        priority: fields.priority,
        status: fields.status,
        dueDate: fields.dueDate || null,
        tags: fields.tags,
        userId: userId ?? "",
      };
      if (taskId) {
        await updateTask(taskId, input);
      } else {
        await addTask(input);
      }
      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleError = submitted && !fields.title.trim();

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="title"
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Título <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={fields.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Nombre de la tarea"
          className={inputBase}
          style={{
            backgroundColor: "var(--color-bg-primary)",
            borderColor: titleError ? "rgb(239 68 68)" : "var(--color-border)",
            color: "var(--color-text-primary)",
            // @ts-expect-error — CSS custom property for focus ring
            "--tw-ring-color": "var(--color-accent)",
          }}
        />
        {titleError && (
          <p className="text-xs text-red-500">El título es obligatorio.</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Descripción
        </label>
        <textarea
          id="description"
          rows={3}
          value={fields.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Detalles opcionales de la tarea"
          className={`${inputBase} resize-none`}
          style={{
            backgroundColor: "var(--color-bg-primary)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        />
      </div>

      {/* Priority + Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="priority"
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Prioridad
          </label>
          <select
            id="priority"
            value={fields.priority}
            onChange={(e) => update("priority", e.target.value as Priority)}
            className={inputBase}
            style={{
              backgroundColor: "var(--color-bg-primary)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            {PRIORITY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="status"
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Estado
          </label>
          <select
            id="status"
            value={fields.status}
            onChange={(e) => update("status", e.target.value as Status)}
            className={inputBase}
            style={{
              backgroundColor: "var(--color-bg-primary)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due date */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="dueDate"
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Fecha límite
        </label>
        <input
          id="dueDate"
          type="date"
          value={fields.dueDate}
          onChange={(e) => update("dueDate", e.target.value)}
          className={inputBase}
          style={{
            backgroundColor: "var(--color-bg-primary)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
            colorScheme: "inherit",
          }}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="tagInput"
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Etiquetas
        </label>
        <input
          id="tagInput"
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Escribe y presiona Enter para agregar"
          className={inputBase}
          style={{
            backgroundColor: "var(--color-bg-primary)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        />
        {fields.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {fields.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs"
                style={{
                  backgroundColor: "var(--color-bg-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 opacity-60 transition-opacity hover:opacity-100"
                  aria-label={`Eliminar etiqueta ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          {isSubmitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {taskId ? "Guardar cambios" : "Crear tarea"}
        </button>
      </div>
    </form>
  );
}

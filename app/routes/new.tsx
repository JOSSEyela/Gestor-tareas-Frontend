import { TaskForm } from "../components/TaskForm";

export default function NewTask() {
  return (
    <main
      className="mx-auto max-w-xl px-4 py-8"
      style={{ color: "var(--color-text-primary)" }}
    >
      <h1 className="mb-6 text-xl font-bold">Nueva tarea</h1>
      <TaskForm />
    </main>
  );
}

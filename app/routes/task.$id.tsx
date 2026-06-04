import { useParams } from "react-router";
import { TaskForm } from "../components/TaskForm";

export default function TaskDetail() {
  const { id } = useParams();
  if (!id) return null;
  return (
    <main
      className="mx-auto max-w-xl px-4 py-8"
      style={{ color: "var(--color-text-primary)" }}
    >
      <h1 className="mb-6 text-xl font-bold">Editar tarea</h1>
      <TaskForm taskId={id} />
    </main>
  );
}

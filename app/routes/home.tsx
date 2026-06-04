import type { Route } from "./+types/home";

export const meta = (_args: Route.MetaArgs) => [{ title: "Task Manager" }]

export default function Home() {
  return <h1>Dashboard</h1>
}

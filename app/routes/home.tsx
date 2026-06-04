import type { Route } from "./+types/home";
import { Dashboard } from "../components/Dashboard";

export const meta = (_args: Route.MetaArgs) => [{ title: "Task Manager" }];

export default function Home() {
  return <Dashboard />;
}

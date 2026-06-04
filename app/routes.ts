import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("task/:id", "routes/task.$id.tsx"),
  route("new", "routes/new.tsx"),
] satisfies RouteConfig;

import { route, type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";
export default [
  route("/", "routes/home.tsx"),
  ...(await flatRoutes({ ignoredRouteFiles: ["routes/home.tsx"] })),
] satisfies RouteConfig;

import { getEnv } from "../lib/env.ts";
import type { RequestProps } from "../lib/types.ts";

export function AutoRefreshScript({ req }: RequestProps) {
  const enableAutoRefresh = getEnv("AUTO_REFRESH", req) === "true";

  return enableAutoRefresh
    ? <script src="/auto-refresh/dev.js" type="module" />
    : null;
}

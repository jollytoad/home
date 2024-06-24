import { getEnv } from "@cross/env";

export function AutoRefreshScript() {
  const enableAutoRefresh = getEnv("AUTO_REFRESH") === "true";

  return enableAutoRefresh
    ? <script src="/auto-refresh/dev.js" type="module" />
    : null;
}

import posthog from "posthog-js";

import {
  getPostHogKey,
  getPostHogUiHost,
  isPostHogEnabled,
} from "./src/lib/posthog-config";

const posthogKey = getPostHogKey();

if (posthogKey && isPostHogEnabled()) {
  posthog.init(posthogKey, {
    api_host: "/ingest",
    ui_host: getPostHogUiHost(),
    defaults: "2026-01-30",
    capture_exceptions: true,
  });
}

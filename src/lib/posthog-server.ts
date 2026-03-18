import "server-only";

import { PostHog } from "posthog-node";

import {
  getPostHogHost,
  getPostHogKey,
  isPostHogEnabled,
} from "@/lib/posthog-config";
import {
  POSTHOG_DISTINCT_ID_HEADER,
  POSTHOG_SESSION_ID_HEADER,
} from "@/lib/posthog-headers";

type PostHogPropertyValue = boolean | null | number | string | undefined;

interface CaptureServerEventParams {
  distinctId: string;
  event: string;
  properties?: Record<string, PostHogPropertyValue>;
}

interface PostHogRequestContext {
  distinctId?: string;
  properties?: Record<string, PostHogPropertyValue>;
}

function getHeaderValue(headers: Headers, name: string) {
  const value = headers.get(name)?.trim();
  return value || undefined;
}

function createPostHogClient() {
  if (!isPostHogEnabled()) {
    return null;
  }

  const posthogKey = getPostHogKey();

  if (!posthogKey) {
    return null;
  }

  return new PostHog(posthogKey, {
    host: getPostHogHost(),
    flushAt: 1,
    flushInterval: 0,
  });
}

export function getPostHogDistinctId(
  ...candidates: Array<string | null | undefined>
) {
  const distinctId = candidates
    .map((candidate) => candidate?.trim())
    .find((candidate): candidate is string => Boolean(candidate));

  return distinctId ?? crypto.randomUUID();
}

export function getPostHogRequestContext(
  request: Request,
): PostHogRequestContext {
  const distinctId = getHeaderValue(
    request.headers,
    POSTHOG_DISTINCT_ID_HEADER,
  );
  const sessionId = getHeaderValue(request.headers, POSTHOG_SESSION_ID_HEADER);

  return {
    distinctId,
    properties: sessionId ? { $session_id: sessionId } : undefined,
  };
}

export async function captureServerEvent({
  distinctId,
  event,
  properties,
}: CaptureServerEventParams) {
  const client = createPostHogClient();

  if (!client) {
    return;
  }

  try {
    client.capture({
      distinctId,
      event,
      properties,
    });
  } catch (error) {
    console.error(`Failed to capture PostHog event: ${event}`, error);
  }

  try {
    await client.shutdown();
  } catch (error) {
    console.error("Failed to flush PostHog events", error);
  }
}

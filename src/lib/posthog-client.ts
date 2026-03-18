"use client";

import posthog from "posthog-js";

import { isPostHogEnabled } from "@/lib/posthog-config";
import {
  POSTHOG_DISTINCT_ID_HEADER,
  POSTHOG_SESSION_ID_HEADER,
} from "@/lib/posthog-headers";

type PostHogPropertyValue = boolean | null | number | string | undefined;

function isPostHogClientEnabled() {
  return isPostHogEnabled();
}

function getPostHogDistinctId() {
  if (!isPostHogClientEnabled()) {
    return undefined;
  }

  try {
    return posthog.get_distinct_id().trim() || undefined;
  } catch {
    return undefined;
  }
}

function getPostHogSessionId() {
  if (!isPostHogClientEnabled()) {
    return undefined;
  }

  try {
    return posthog.get_session_id().trim() || undefined;
  } catch {
    return undefined;
  }
}

export function capturePostHogEvent(
  event: string,
  properties?: Record<string, PostHogPropertyValue>,
) {
  if (!isPostHogClientEnabled()) {
    return;
  }

  posthog.capture(event, properties);
}

export function capturePostHogException(error: unknown) {
  if (!isPostHogClientEnabled()) {
    return;
  }

  posthog.captureException(error);
}

export function createPostHogHeaders(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);

  if (!isPostHogClientEnabled()) {
    return nextHeaders;
  }

  const distinctId = getPostHogDistinctId();
  const sessionId = getPostHogSessionId();

  if (distinctId) {
    nextHeaders.set(POSTHOG_DISTINCT_ID_HEADER, distinctId);
  }

  if (sessionId) {
    nextHeaders.set(POSTHOG_SESSION_ID_HEADER, sessionId);
  }

  return nextHeaders;
}

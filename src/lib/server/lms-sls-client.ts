type TransactionalMailResult =
  | { ok: true }
  | { ok: false; reason: "missing_config" }
  | { ok: false; reason: "send_failed"; error: unknown };

type SaveContactRequestResult =
  | { ok: true }
  | { ok: false; reason: "missing_config" }
  | { ok: false; reason: "send_failed"; error: unknown };

export interface ContactRequestPayload {
  requestType: "contact" | "service";
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  country?: string | null;
  phone?: string | null;
  preferredContactMethod?: string | null;
  social?: string | null;
  message?: string | null;
  service?: string | null;
}

function getLmsSlsConfig() {
  const baseUrl = process.env.LMS_SLS_URL?.trim();
  const internalApiKey = (
    process.env.LMS_SLS_PUBLIC_API_KEY ?? process.env.INTERNAL_API_KEY
  )?.trim();

  if (!baseUrl || !internalApiKey) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), internalApiKey };
}

export async function saveContactRequest(
  payload: ContactRequestPayload,
): Promise<SaveContactRequestResult> {
  const config = getLmsSlsConfig();
  if (!config) return { ok: false, reason: "missing_config" };

  try {
    const response = await fetch(`${config.baseUrl}/api/contact-requests`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-api-key": config.internalApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) return { ok: true };

    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    return {
      ok: false,
      reason: "send_failed",
      error: body?.error ?? `HTTP ${response.status}`,
    };
  } catch (error) {
    return { ok: false, reason: "send_failed", error };
  }
}

export async function sendTransactionalMail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<TransactionalMailResult> {
  const config = getLmsSlsConfig();
  if (!config) return { ok: false, reason: "missing_config" };

  try {
    const response = await fetch(`${config.baseUrl}/api/mail/transactional`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-api-key": config.internalApiKey,
      },
      body: JSON.stringify({ subject, text, replyTo }),
    });

    if (response.ok) return { ok: true };

    // Backend returns 500 only for a missing/unconfigured mail provider and
    // 502 for an actual send failure, so status alone classifies the error.
    if (response.status === 500) return { ok: false, reason: "missing_config" };

    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    return {
      ok: false,
      reason: "send_failed",
      error: payload?.error ?? `HTTP ${response.status}`,
    };
  } catch (error) {
    return { ok: false, reason: "send_failed", error };
  }
}

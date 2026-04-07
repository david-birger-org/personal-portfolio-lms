type TransactionalMailResult =
  | { ok: true }
  | { ok: false; reason: "missing_config" }
  | { ok: false; reason: "missing_destination" }
  | { ok: false; reason: "send_failed"; error: unknown };

function getLmsSlsConfig() {
  const baseUrl = process.env.LMS_SLS_URL?.trim();
  const internalApiKey = process.env.INTERNAL_API_KEY?.trim();

  if (!baseUrl || !internalApiKey) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), internalApiKey };
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

    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    if (response.status === 500 && payload?.error?.includes("not configured"))
      return { ok: false, reason: "missing_config" };

    return {
      ok: false,
      reason: "send_failed",
      error: payload?.error ?? `HTTP ${response.status}`,
    };
  } catch (error) {
    return { ok: false, reason: "send_failed", error };
  }
}

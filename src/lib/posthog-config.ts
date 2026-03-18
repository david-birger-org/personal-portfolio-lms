type PostHogEnv = Record<string, string | undefined>;

const DEFAULT_POSTHOG_HOST = "https://us.i.posthog.com";
const DEFAULT_POSTHOG_UI_HOST = "https://us.posthog.com";
const DEFAULT_POSTHOG_ASSET_HOST = "https://us-assets.i.posthog.com";

function getFirstDefinedValue(env: PostHogEnv, keys: readonly string[]) {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) {
      return value;
    }
  }

  return "";
}

function getOrigin(value: string, fallback: string) {
  try {
    return new URL(value).origin;
  } catch {
    return fallback;
  }
}

function mapCloudHost(
  host: string,
  transformHostname: (hostname: string) => string,
  fallback: string,
) {
  try {
    const url = new URL(host);

    if (url.hostname.endsWith(".i.posthog.com")) {
      url.hostname = transformHostname(url.hostname);
    }

    return url.origin;
  } catch {
    return fallback;
  }
}

export function getPostHogKey(env: PostHogEnv = process.env) {
  return getFirstDefinedValue(env, [
    "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN",
    "NEXT_PUBLIC_POSTHOG_KEY",
    "NEXT_PUBLIC_POSTHOG_TOKEN",
  ]);
}

export function isPostHogEnabled(env: PostHogEnv = process.env) {
  return env.NODE_ENV === "production" && Boolean(getPostHogKey(env));
}

export function getPostHogHost(env: PostHogEnv = process.env) {
  return getOrigin(
    getFirstDefinedValue(env, ["NEXT_PUBLIC_POSTHOG_HOST"]) ||
      DEFAULT_POSTHOG_HOST,
    DEFAULT_POSTHOG_HOST,
  );
}

export function getPostHogUiHost(env: PostHogEnv = process.env) {
  return mapCloudHost(
    getPostHogHost(env),
    (hostname) => hostname.replace(/\.i\.posthog\.com$/, ".posthog.com"),
    DEFAULT_POSTHOG_UI_HOST,
  );
}

export function getPostHogAssetHost(env: PostHogEnv = process.env) {
  return mapCloudHost(
    getPostHogHost(env),
    (hostname) =>
      hostname.replace(/\.i\.posthog\.com$/, "-assets.i.posthog.com"),
    DEFAULT_POSTHOG_ASSET_HOST,
  );
}

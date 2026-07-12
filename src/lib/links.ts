// A link is counted as retrieval metadata only when it is a valid HTTP or HTTPS URL.
export function isValidHttpUrl(value: unknown): boolean {
  return normalizeReadableHttpUrl(value) !== null;
}

export function normalizeReadableHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function extractValidHttpUrls(input: unknown): string[] {
  const values = Array.isArray(input) ? input : [input];
  const urls: string[] = [];

  for (const value of values) {
    const url = normalizeReadableHttpUrl(value);

    if (url && !urls.includes(url)) {
      urls.push(url);
    }
  }

  return urls;
}

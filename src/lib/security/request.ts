function firstHeaderValue(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value
    .split(",")[0]
    ?.trim()
    .toLowerCase() ?? null;
}

function defaultPortForProtocol(protocol: string): string {
  if (protocol === "https:") {
    return "443";
  }
  if (protocol === "http:") {
    return "80";
  }
  return "";
}

/**
 * Reject cross-origin browser requests for cookie-authenticated state-changing endpoints.
 * If Origin is missing (e.g. curl/server-to-server), we allow the request.
 */
export function hasTrustedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) {
    return true;
  }

  const host =
    firstHeaderValue(req.headers.get("x-forwarded-host")) ??
    firstHeaderValue(req.headers.get("host"));
  if (!host) {
    return false;
  }

  const forwardedProto = firstHeaderValue(req.headers.get("x-forwarded-proto"));
  const reqUrl = new URL(req.url);
  const protocol = forwardedProto ?? reqUrl.protocol.replace(":", "");

  try {
    const requestOrigin = new URL(origin);
    const expectedOrigin = new URL(`${protocol}://${host}`);

    const requestPort =
      requestOrigin.port || defaultPortForProtocol(requestOrigin.protocol);
    const expectedPort =
      expectedOrigin.port || defaultPortForProtocol(expectedOrigin.protocol);

    return (
      requestOrigin.protocol === expectedOrigin.protocol &&
      requestOrigin.hostname === expectedOrigin.hostname &&
      requestPort === expectedPort
    );
  } catch {
    return false;
  }
}

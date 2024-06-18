/**
 * Get the value of the Deferred-Timeout header if provided
 */
export function getDeferredTimeout(req: Request): number | false | undefined {
  if (req.headers.has("Deferred-Timeout")) {
    const deferredTimeoutHeader = req.headers.get("Deferred-Timeout");
    const deferredTimeout = deferredTimeoutHeader === "false"
      ? false
      : Number.parseInt(deferredTimeoutHeader ?? "");

    if (deferredTimeout === false || Number.isSafeInteger(deferredTimeout)) {
      return deferredTimeout;
    }
  }
}

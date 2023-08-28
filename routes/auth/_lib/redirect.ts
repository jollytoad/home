import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";

export const REDIRECT_URL_COOKIE_NAME = "redirect-url";

export function setRedirectUrlCookie(
  req: Request,
  res: Response | null,
): Response | void {
  if (res && req.headers.has("referer")) {
    setCookie(res.headers, {
      name: REDIRECT_URL_COOKIE_NAME,
      value: req.headers.get("referer")!,
      path: "/",
    });
  }
}

export function getRedirectUrl(req: Request): string | undefined {
  return getCookies(req.headers)[REDIRECT_URL_COOKIE_NAME];
}

export function deleteRedirectUrlCookie(
  _req: Request,
  res: Response | null,
): Response | void {
  if (res) {
    deleteCookie(res.headers, REDIRECT_URL_COOKIE_NAME);
    return res;
  }
}

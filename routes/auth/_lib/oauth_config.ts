import { badRequest } from "$http_fns/response/bad_request.ts";
import { notFound } from "$http_fns/response/not_found.ts";
import {
  getOAuthClientScope,
  getOAuthConfigFn,
  type OAuth2ClientConfig,
} from "../../../lib/oauth_config.ts";

export async function asOAuth2ClientConfig(
  req: Request,
  match: URLPatternResult,
): Promise<OAuth2ClientConfig> {
  const provider = match.pathname.groups.provider;

  if (!provider) {
    throw badRequest();
  }

  const createOAuthConfig = getOAuthConfigFn(provider);

  if (!createOAuthConfig) {
    throw notFound();
  }

  const redirectUri = new URL("callback", req.url).href;
  const scope = await getOAuthClientScope(provider);

  return createOAuthConfig({
    redirectUri,
    scope,
  });
}

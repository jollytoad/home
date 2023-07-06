export interface RequestProps {
  req: Request;
}

export interface RouteProps extends RequestProps {
  match: URLPatternResult;
}

export function asRouteProps(
  req: Request,
  match: URLPatternResult,
): RouteProps {
  return { req, match };
}

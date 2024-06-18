export interface RequestProps {
  req: Request;
}

export interface RouteProps extends RequestProps {
  match: URLPatternResult;
}

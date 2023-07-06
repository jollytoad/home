interface Props {
  module?: string;
  children?: string;
}

export function Src({ module, children }: Props) {
  const [, path] = module?.split("/routes/") ?? [];
  const href = path
    ? `https://github.com/jollytoad/home/blob/main/routes/${path}`
    : undefined;

  if (href) {
    return (
      <div class="src">
        <a href={href} target="_blank">{children ?? "View source on GitHub"}</a>
      </div>
    );
  }
  return null;
}

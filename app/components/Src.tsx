interface Props {
  module?: string | URL;
  children?: string;
}

export function Src({ module, children }: Props) {
  const root = import.meta.resolve("../..");
  const path = module?.toString().replace(root, "");

  if (path) {
    const href = `https://github.com/jollytoad/home/blob/main/${path}`;
    return (
      <div class="src">
        <a href={href} target="_blank">{children ?? "View source on GitHub"}</a>
      </div>
    );
  }
  return null;
}

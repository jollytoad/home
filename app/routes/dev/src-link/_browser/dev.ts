// deno-lint-ignore-file no-window no-window-prefix
/**
 * Enable Option/Alt clicking on an element to open the source link in vscode
 */
function enableSrcLinks() {
  const attr = new URL(import.meta.url).searchParams.get("attr") ?? "jsx-src";

  console.log(`%cENABLE SRC LINKS: ${attr}`, "color: green");

  window.addEventListener("click", (event) => {
    const el = event.target as (Element | null);
    if (event.altKey && el?.hasAttribute(attr)) {
      const src = el.getAttribute(attr);
      let url = URL.parse(src ?? "");
      if (url?.protocol === "file:") {
        const hash = url.hash.replace(/^#/, ":");
        url = new URL(`vscode://file${url.pathname}${hash}`);
      }
      if (url) {
        console.log("OPEN SRC LINK:", url.href);
        window.open(url, "_blank");
      }
    }
  });
}

enableSrcLinks();

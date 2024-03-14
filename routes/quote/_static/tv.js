document.body.classList.add("ready");

const refresh =
  document.head.querySelector('meta[name="refresh"]')?.getAttribute(
    "content",
  ) ?? 1;

setTimeout(() => {
  document.body.classList.remove("ready");
  document.body.classList.add("out");
  document.body.addEventListener("transitionend", () => {
    location.reload();
  });
}, refresh * 1000);

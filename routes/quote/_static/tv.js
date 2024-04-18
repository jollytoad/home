setTimeout(() => {
  document.body.classList.add("in");
}, 100);

const refresh = document.head.querySelector('meta[name="refresh"]')
  ?.getAttribute(
    "content",
  );

if (refresh) {
  setTimeout(() => {
    document.body.classList.remove("in");
    document.body.classList.add("out");
    document.body.addEventListener("transitionend", () => {
      location.reload();
    });
  }, refresh * 1000);
}

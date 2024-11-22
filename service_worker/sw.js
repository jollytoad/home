import handler from "./routes.ts";

self.addEventListener("fetch", async (event) => {
  const response = await handler(event.request);
  if (response) {
    event.respondWith(response);
  }
});

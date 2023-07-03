import handler from "./routes.ts";

console.log("SERVICE WORKER");

self.addEventListener("fetch", async (event) => {
  console.log("FETCH");
  const response = await handler(event.request);
  if (response) {
    event.respondWith(response);
  }
});

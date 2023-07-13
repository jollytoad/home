export default async function sleep() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return new Response("done");
}

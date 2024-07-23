function ReadableStream_from<T>(
  iterable: Iterable<T | PromiseLike<T>> | AsyncIterable<T>,
): ReadableStream<T> {
  const iterator: Iterator<T> | AsyncIterator<T> =
    (iterable as AsyncIterable<T>)[Symbol.asyncIterator]?.() ??
      (iterable as Iterable<T>)[Symbol.iterator]?.();

  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(await value);
      }
    },
    async cancel(reason) {
      if (typeof iterator.throw == "function") {
        try {
          await iterator.throw(reason);
        } catch { /* `iterator.throw()` always throws on site. We catch it. */ }
      }
    },
  });
}

export default ReadableStream_from satisfies typeof ReadableStream.from;

import { GenerateContentResponse } from "@google/generative-ai";

/**
 * Transforms an async iterable stream of Gemini response chunks into a Web ReadableStream
 */
export function createTextResponseStream(
  streamResult: AsyncIterable<GenerateContentResponse>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamResult) {
          const text = typeof (chunk as any).text === "function" ? (chunk as any).text() : "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (error) {
        console.error("[Stream Error]", error);
        controller.error(error);
      }
    },
  });
}

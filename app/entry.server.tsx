import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { ServerRouter, type EntryContext } from "react-router";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  let didError = false;
  const stream = await renderToReadableStream(<ServerRouter context={routerContext} url={request.url} />, {
    signal: request.signal,
    onError(error: unknown) {
      didError = true;
      console.error(error);
    },
  });

  // Ботам — полный документ, браузерам — поток.
  if (isbot(request.headers.get("user-agent") || "")) await stream.allReady;

  responseHeaders.set("Content-Type", "text/html");
  return new Response(stream, { status: didError ? 500 : responseStatusCode, headers: responseHeaders });
}

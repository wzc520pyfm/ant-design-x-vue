/**
 * Browser-local OpenAI / DeepSeek SSE stand-ins for docs demos.
 * The docs site does not call a real model.
 */
export function defaultMockReply(userText: string) {
  const question = userText.trim() || 'hello';
  return [
    `Local mock reply for **${question}**.`,
    '',
    '- The request stays in the browser',
    '- Chunks follow the OpenAI chat SSE shape',
    '',
    '```ts',
    'const answer = "mocked";',
    '```',
  ].join('\n');
}

function streamOpenAIPieces(
  pieces: string[],
  encodeDelta: (piece: string, index: number) => object,
) {
  const encoder = new TextEncoder();
  let index = 0;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      const tick = () => {
        if (index < pieces.length) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(encodeDelta(pieces[index], index))}\n\n`),
          );
          index += 1;
          setTimeout(tick, 30);
          return;
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      };
      setTimeout(tick, 20);
    },
  });
}

function readUserText(options?: { body?: BodyInit | null }) {
  let userText = '';
  try {
    const raw = typeof options?.body === 'string' ? options.body : '';
    const body = raw ? JSON.parse(raw) : {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const lastUser = [...messages].reverse().find((item: any) => item?.role === 'user');
    userText = typeof lastUser?.content === 'string' ? lastUser.content : '';
  } catch {
    userText = '';
  }
  return userText;
}

export function createMockOpenAIFetch(replyFor: (userText: string) => string = defaultMockReply) {
  return async (_baseURL: RequestInfo | URL, options?: { body?: BodyInit | null }) => {
    const reply = replyFor(readUserText(options));
    const pieces = reply.match(/[\s\S]{1,18}/g) || [reply];
    const stream = streamOpenAIPieces(pieces, (piece) => ({
      choices: [{ delta: { role: 'assistant', content: piece } }],
    }));
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    });
  };
}

/** DeepSeek-shaped SSE: reasoning_content first, then content. */
export function createMockDeepSeekFetch(
  replyFor: (userText: string) => { think: string; content: string } = (userText) => ({
    think: `Thinking about: ${userText.trim() || 'hello'}`,
    content: defaultMockReply(userText),
  }),
) {
  return async (_baseURL: RequestInfo | URL, options?: { body?: BodyInit | null }) => {
    const { think, content } = replyFor(readUserText(options));
    const thinkPieces = think.match(/[\s\S]{1,24}/g) || [think];
    const contentPieces = content.match(/[\s\S]{1,18}/g) || [content];
    const encoder = new TextEncoder();
    let phase: 'think' | 'content' | 'done' = 'think';
    let index = 0;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const tick = () => {
          if (phase === 'think') {
            if (index < thinkPieces.length) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    choices: [{ delta: { role: 'assistant', reasoning_content: thinkPieces[index] } }],
                  })}\n\n`,
                ),
              );
              index += 1;
              setTimeout(tick, 30);
              return;
            }
            phase = 'content';
            index = 0;
            setTimeout(tick, 30);
            return;
          }
          if (phase === 'content') {
            if (index < contentPieces.length) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    choices: [{ delta: { content: contentPieces[index] } }],
                  })}\n\n`,
                ),
              );
              index += 1;
              setTimeout(tick, 30);
              return;
            }
            phase = 'done';
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        };
        setTimeout(tick, 20);
      },
    });

    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    });
  };
}

export function createMockJsonFetch(payload: unknown, delayMs = 0) {
  return async () => {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
}

export function createMockNdjsonFetch(lines: string[], gapMs = 100) {
  return async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        for (const line of lines) {
          await new Promise((resolve) => setTimeout(resolve, gapMs));
          controller.enqueue(encoder.encode(line));
        }
        controller.close();
      },
    });
    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'application/x-ndjson' },
    });
  };
}

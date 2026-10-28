/**
 * Browser-local OpenAI SSE stand-in for docs demos.
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

export function createMockOpenAIFetch(replyFor: (userText: string) => string = defaultMockReply) {
  return async (_baseURL: RequestInfo | URL, options?: { body?: BodyInit | null }) => {
    let userText = '';
    try {
      const raw = typeof options?.body === 'string' ? options.body : '';
      const body = raw ? JSON.parse(raw) : {};
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const lastUser = [...messages].reverse().find((item) => item?.role === 'user');
      userText = typeof lastUser?.content === 'string' ? lastUser.content : '';
    } catch {
      userText = '';
    }

    const reply = replyFor(userText);
    const pieces = reply.match(/[\s\S]{1,18}/g) || [reply];
    const encoder = new TextEncoder();
    let index = 0;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const tick = () => {
          if (index < pieces.length) {
            const payload = {
              choices: [{ delta: { role: 'assistant', content: pieces[index] } }],
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
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

    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    });
  };
}

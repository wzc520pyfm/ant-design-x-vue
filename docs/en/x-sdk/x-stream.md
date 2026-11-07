# XStream

Collect `ReadableStream\<Uint8Array>` into asynchronously iterable records. If `transformStream` is not passed, split according to SSE: events are separated by blank lines and `:` separates field names and values.

```ts
import { XStream } from 'ant-design-x-vue';

for await (const chunk of XStream({ readableStream })) {
  console.log(chunk);
}
```

If `readableStream` is not a `ReadableStream`, throw `The options.readableStream must be an instance of ReadableStream.`

### Default protocol — SSE

:::demo-v2 Assemble Hello, world! from in-memory SSE chunks with no network request.

x-sdk/x-stream/default-protocol

:::

### Custom protocol

:::demo-v2 Pass `transformStream` to read in chunks according to a custom protocol (SIP/SDP text).

x-sdk/x-stream/custom-protocol

:::

## API

### XStreamOptions

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| readableStream | Binary readable stream | ReadableStream\<Uint8Array\> | - | - |
| transformStream | Custom TransformStream; if not passed, the default SSE transform is used | TransformStream\<string, T\> | sseTransformStream | - |

```ts | pure
type SSEFields = 'data' | 'event' | 'id' | 'retry';
type SSEOutput = Partial<Record<SSEFields, any>>;

type XReadableStream<R = SSEOutput> = ReadableStream<R> & AsyncGenerator<R>;

function XStream<Output = SSEOutput>(
  options: XStreamOptions<Output>,
): XReadableStream<Output>;
```

The 1.x page is still at [XStream Stream](https://antd-design-x-vue.netlify.app/component/x-stream). The usage in 2.0 is the same, implemented from `@ant-design-x-vue/x-sdk`.

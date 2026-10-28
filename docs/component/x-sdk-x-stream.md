# XStream

把 `ReadableStream<Uint8Array>` 收成可异步迭代的记录。不传 `transformStream` 时按 SSE 拆：空行分隔事件，`:` 分隔字段名和值。

```ts
import { XStream } from 'ant-design-x-vue';

for await (const chunk of XStream({ readableStream })) {
  console.log(chunk);
}
```

`readableStream` 不是 `ReadableStream` 时抛出 `The options.readableStream must be an instance of ReadableStream.`

:::demo-v2 用内存里的两段 SSE，不发网络请求。

x-sdk/x-stream

:::

1.x 页面仍在 [XStream 流](/v1/component/x-stream)。2.0 的调用形式相同，实现来自 `@ant-design-x-vue/x-sdk`。

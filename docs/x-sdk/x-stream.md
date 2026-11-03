# XStream

把 `ReadableStream<Uint8Array>` 收成可异步迭代的记录。不传 `transformStream` 时按 SSE 拆：空行分隔事件，`:` 分隔字段名和值。

```ts
import { XStream } from 'ant-design-x-vue';

for await (const chunk of XStream({ readableStream })) {
  console.log(chunk);
}
```

`readableStream` 不是 `ReadableStream` 时抛出 `The options.readableStream must be an instance of ReadableStream.`

### 默认协议 - SSE

:::demo-v2 用内存里的 SSE 片段拼出 Hello, world!，不发网络请求。

x-sdk/x-stream/default-protocol

:::

### 自定义协议

:::demo-v2 传入 `transformStream`，按自定义协议（SIP/SDP 文本）逐块读取。

x-sdk/x-stream/custom-protocol

:::

1.x 页面仍在 [XStream 流](https://antd-design-x-vue.netlify.app/component/x-stream)。2.0 的调用形式相同，实现来自 `@ant-design-x-vue/x-sdk`。

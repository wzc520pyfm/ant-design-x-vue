
# XStream 流

转换可读数据流。

## 何时使用

* 将 SSE 协议的 `ReadableStream` 转换为 `Record`
* 将任何协议的 `ReadableStream` 解码并读取

## 使用说明

常见的 `ReadableStream` 实例，如 `await fetch(...).body` 使用示例:

```js
import { XStream } from 'ant-design-x-vue';

async function request() {
  const response = await fetch();
  // .....

  for await (const chunk of XStream({
    readableStream: response.body,
  })) {
    console.log(chunk);
  }
}
```

## 代码演示

### 默认协议 - SSE

> SSE - https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events

:::demo XStream 默认的 `transformStream` 是用于 SSE 协议的流转换器。`readableStream` 接收一个 `new ReadableStream(...)` 实例，常见的如 `await fetch(...).body`

x-stream/default-protocol

:::

### 自定义协议

> 在本示例中，我们将演示如何解析 SIP 协议, 该协议常用于 P2P 音视频会话协商。

:::demo 传入 `transformStream` 流转换器，该参数需接收一个 `new TransformStream(...)` 实例。

x-stream/custom-protocol

:::

## API

### XStreamOptions

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| readableStream | ReadableStream 实例 | ReadableStream<'Uint8Array'> | - | - |
| transformStream | 自定义的 transformStream 用于转换流的处理 | TransformStream<string, T> | sseTransformStream | - |
## 贡献者

<doc-contributors component-name="x-stream" :max-count="50" :show-view-all="true" />

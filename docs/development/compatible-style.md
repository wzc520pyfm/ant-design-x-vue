# StyleProvider 样式兼容

兼容旧版浏览器，请根据实际需求进行降级处理。

## 使用说明

`StyleProvider` 继承了 `antdv` 的 [`StyleProvider🔗`](https://www.antdv.com/docs/vue/compatible-style-cn)。

如果您已经使用 `antdv` 的 `StyleProvider`，请对您的代码做如下变更：

```diff
- import { StyleProvider } from 'ant-design-vue';
+ import { StyleProvider } from 'ant-design-x-vue';

  const App = () => (
    <StyleProvider>
      <YourApp />
    </StyleProvider>
  );
```

# XProvider 全局化配置

为组件提供统一的全局化配置。

## 使用说明

`XProvider` 继承了 `antdv` 的 `ConfigProvider`，且为 `ant-design-x-vue` 中的组件提供全局化配置。

如果您已经使用 `antdv` 的 `ConfigProvider`，请对您的代码做如下变更：

```diff
- import { ConfigProvider } from 'ant-design-vue';
+ import { XProvider } from 'ant-design-x-vue';

  const App = () => (
-   <ConfigProvider>
+   <XProvider>
      <YourApp />
-   </ConfigProvider>
+   </XProvider>
  );
```

## 代码演示

### 使用

:::demo 如何使用

x-provider/use

:::

## API

`XProvider` 完全继承 `antdv` 的 `ConfigProvider`, 属性参考：[Antdv ConfigProvider](https://www.antdv.com/components/config-provider-cn#api)

### 组件配置

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bubble | 气泡组件的全局配置 | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| conversations | 会话组件的全局配置 | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| prompts | 提示集组件的全局配置 | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| sender | 输入框组件的全局配置 | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| suggestion | 建议组件的全局配置 | 'className' \| 'style' | - |  |
| thoughtChain | 思维链组件的全局配置 | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
## 贡献者

<doc-contributors component-name="x-provider" :max-count="50" :show-view-all="true" />

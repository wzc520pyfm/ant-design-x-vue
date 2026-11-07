# StyleProvider style compatibility

For compatibility with older browsers, perform downgrading according to actual needs.

## Usage notes

`StyleProvider` inherits from `antdv`'s [`StyleProvider🔗`](https://www.antdv.com/docs/vue/compatible-style-cn).

If you are already using `antdv`'s `StyleProvider`, please make the following changes to your code:

```diff
- import { StyleProvider } from 'ant-design-vue';
+ import { StyleProvider } from 'ant-design-x-vue';

  const App = () => (
    <StyleProvider>
      <YourApp />
    </StyleProvider>
  );
```

<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownPluginsV2' });

import { ref } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Flex, Switch } from 'ant-design-vue';

const enabled = ref(true);
const content = 'Ship the TODO before Friday.';

const emphasizeTodo = {
  transform(source: string) {
    return source.replaceAll('TODO', '**TODO**');
  },
};

defineRender(() => (
  <Flex vertical gap={12}>
    <Switch v-model:checked={enabled.value} checked-children="plugin" un-checked-children="plain" />
    <XMarkdown content={content} plugins={enabled.value ? [emphasizeTodo] : []} />
  </Flex>
));
</script>

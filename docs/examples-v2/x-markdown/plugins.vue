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
  <Flex vertical gap={12} align="flex-start">
    <Flex align="center" gap={8} style={{ alignSelf: 'flex-start' }}>
      <Switch v-model:checked={enabled.value} />
      <span>plugin</span>
    </Flex>
    <XMarkdown content={content} plugins={enabled.value ? [emphasizeTodo] : []} />
  </Flex>
));
</script>

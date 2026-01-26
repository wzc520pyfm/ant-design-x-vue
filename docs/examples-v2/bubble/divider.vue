<script setup lang="tsx">
import { Bubble } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';

defineRender(() => (
  <Flex gap={16} vertical>
    <Bubble content="message 1" />
    <Bubble.Divider content="Solid" />
    <Bubble content="message 2" placement="end" />
    <Bubble.Divider content="Dashed" dividerProps={{ variant: 'dashed' }} />
    <Bubble content="message 3" />
    <Bubble.Divider content="Dotted" dividerProps={{ variant: 'dotted' }} />
    <Bubble content="message 4" placement="end" />
    <Bubble.Divider content="Plain Text" dividerProps={{ plain: true }} />
    <Bubble content="message 5" />
  </Flex>
));
</script>

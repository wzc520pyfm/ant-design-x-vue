<script setup lang="tsx">
import { FileCard } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';

defineRender(() => (
  <Flex vertical gap="middle">
    <FileCard name="pdf-file.pdf" byte={1024} size="small" />
    <FileCard name="pdf-file.pdf" byte={1024} size="default" />
  </Flex>
));
</script>

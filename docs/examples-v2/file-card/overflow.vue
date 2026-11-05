<script setup lang="tsx">
defineOptions({ name: 'AXFileCardOverflowV2' });

import { FileCard } from 'ant-design-x-vue';
import type { FileCardListProps } from 'ant-design-x-vue';
import { Flex, Segmented } from 'ant-design-vue';
import { ref } from 'vue';

const images = Array.from({ length: 11 }).map((_, index) => ({
  name: `image-file-${index}.png`,
  src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  byte: 1024,
}));

const files = [
  { name: 'excel-file.xlsx', byte: 1024 },
  { name: 'word-file.docx', byte: 1024 },
  { name: 'pdf-file.pdf', byte: 1024 },
  { name: 'ppt-file.pptx', byte: 1024 },
  { name: 'zip-file.zip', byte: 1024 },
  { name: 'txt-file.txt', byte: 1024 },
];

const overflow = ref<FileCardListProps['overflow']>('wrap');

defineRender(() => (
  <Flex vertical gap="middle">
    <Segmented
      options={[
        { value: 'wrap', label: 'Wrap' },
        { value: 'scrollX', label: 'Scroll X' },
        { value: 'scrollY', label: 'Scroll Y' },
      ]}
      value={overflow.value}
      onChange={(val: any) => (overflow.value = val)}
      style={{ marginInlineEnd: 'auto' }}
    />
    <FileCard.List items={[...images, ...files]} removable overflow={overflow.value} />
  </Flex>
));
</script>

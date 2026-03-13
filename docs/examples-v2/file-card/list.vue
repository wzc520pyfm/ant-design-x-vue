<script setup lang="tsx">
defineOptions({ name: 'AXFileCardListV2' });

import { FileCard } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';

const files = [
  { name: 'excel-file.xlsx', byte: 1024 },
  { name: 'word-file.docx', byte: 1024 },
  { name: 'pdf-file.pdf', byte: 1024 },
  { name: 'ppt-file.pptx', byte: 1024 },
  { name: 'zip-file.zip', byte: 1024 },
  { name: 'txt-file.txt', byte: 1024 },
];

defineRender(() => (
  <Flex vertical gap="middle" style={{ width: '900px' }}>
    <FileCard.List items={files} removable />
    <FileCard.List items={files} removable size="small" />
    <FileCard.List
      items={new Array(6).fill({
        name: 'image-file.png',
        src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      })}
    />
    <FileCard.List
      styles={{ file: { width: '230px', height: '230px' } }}
      items={new Array(3).fill({
        name: 'image-file.png',
        src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      })}
    />
  </Flex>
));
</script>

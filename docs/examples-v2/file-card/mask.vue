<script setup lang="tsx">
defineOptions({ name: 'AXFileCardMaskV2' });

import { FileCard } from 'ant-design-x-vue';
import { VerticalAlignBottomOutlined } from '@ant-design/icons-vue';

const onDownload = () => {
  const blob = new Blob(['123'], { type: 'text/plain' });
  const a = document.createElement('a');
  const href = URL.createObjectURL(blob);
  a.href = href;
  a.download = 'txt-file.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(href);
};

defineRender(() => (
  <FileCard
    name="txt-file.txt"
    byte={1024}
    mask={<VerticalAlignBottomOutlined style={{ fontSize: '20px' }} onClick={() => onDownload()} />}
  />
));
</script>

<script setup lang="tsx">
defineOptions({ name: 'AXSenderPasteImageV2' });

import { ref } from 'vue';
import { CloudUploadOutlined, PaperClipOutlined } from '@ant-design/icons-vue';
import { Attachments, Sender } from 'ant-design-x-vue';
import type { AttachmentsProps } from 'ant-design-x-vue';
import { Button, Flex } from 'ant-design-vue';

const open = ref(false);
const items = ref<AttachmentsProps['items']>([]);
const text = ref('');
const attachmentsRef = ref<InstanceType<typeof Attachments> | null>(null);
const senderRef = ref<InstanceType<typeof Sender> | null>(null);

const senderHeader = () => (
  <Sender.Header
    title="Attachments"
    styles={{ content: { padding: 0 } }}
    open={open.value}
    onOpenChange={(val: boolean) => { open.value = val; }}
    forceRender
  >
    <Attachments
      ref={attachmentsRef}
      beforeUpload={() => false}
      items={items.value}
      onChange={({ fileList }: any) => { items.value = fileList; }}
      placeholder={(type: string) =>
        type === 'drop'
          ? { title: 'Drop file here' }
          : {
              icon: <CloudUploadOutlined />,
              title: 'Upload files',
              description: 'Click or drag files to this area to upload',
            }
      }
      getDropContainer={() => senderRef.value?.nativeElement}
    />
  </Sender.Header>
);

defineRender(() => (
  <Flex style={{ height: '220px' }} align="end">
    <Sender
      ref={senderRef}
      header={senderHeader()}
      prefix={
        <Button
          type="text"
          style={{ fontSize: '16px' }}
          icon={<PaperClipOutlined />}
          onClick={() => { open.value = !open.value; }}
        />
      }
      value={text.value}
      onChange={(val: string) => { text.value = val; }}
      onPasteFile={(files: FileList) => {
        for (const file of files) {
          attachmentsRef.value?.upload(file);
        }
        open.value = true;
      }}
      onSubmit={() => {
        items.value = [];
        text.value = '';
      }}
    />
  </Flex>
));
</script>

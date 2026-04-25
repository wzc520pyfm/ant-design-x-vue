<script setup lang="tsx">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  CloudUploadOutlined,
  FileImageOutlined,
  FileWordOutlined,
  LinkOutlined,
} from '@ant-design/icons-vue';
import { App, Badge, Button, Dropdown, Flex, Typography } from 'ant-design-vue';
import {
  Attachments,
  Sender,
  type AttachmentsProps,
  type AttachmentsRef,
  type SenderRef,
} from 'ant-design-x-vue';

defineOptions({ name: 'AXAttachmentsSelectFiles' });

const MAX_COUNT = 5;

const Demo = () => {
  const { notification } = App.useApp();

  const open = ref(false);
  const items = ref<AttachmentsProps['items']>([]);
  const text = ref('');

  const senderRef = ref<SenderRef | null>(null);
  const attachmentsRef = ref<AttachmentsRef | null>(null);

  onBeforeUnmount(() => {
    items.value?.forEach((item) => {
      if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url);
    });
  });

  watch(
    () => items.value?.length ?? 0,
    (length) => {
      open.value = length > 0;
    },
  );

  const acceptItems = [
    {
      key: 'image',
      label: (
        <Flex gap="small">
          <FileImageOutlined />
          <span>Image</span>
        </Flex>
      ),
    },
    {
      key: 'docs',
      label: (
        <Flex gap="small">
          <FileWordOutlined />
          <span>Docs</span>
        </Flex>
      ),
    },
  ];

  const selectFile = ({ key }: { key: string }) => {
    attachmentsRef.value?.select({
      accept: key === 'image' ? '.png,.jpg,.jpeg' : '.doc,.docx',
      multiple: true,
    });
  };

  const senderHeader = (
    <Sender.Header
      closable={false}
      forceRender
      title="Attachments"
      open={open.value}
      onOpenChange={(v: boolean) => (open.value = v)}
      styles={{ content: { padding: 0 } }}
    >
      <Attachments
        ref={attachmentsRef}
        multiple
        maxCount={MAX_COUNT}
        beforeUpload={() => false}
        items={items.value}
        onChange={({ file, fileList }: any) => {
          const updated = fileList.map((item: any) => {
            if (item.uid === file.uid && file.status !== 'removed' && item.originFileObj) {
              if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url);
              return { ...item, url: URL.createObjectURL(item.originFileObj) };
            }
            return item;
          });
          items.value = updated;
        }}
        placeholder={(type: string) =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
                icon: <CloudUploadOutlined />,
                title: 'Upload files',
                description: 'Click or drag files to this area to upload',
              }
        }
        getDropContainer={() => senderRef.value?.nativeElement as HTMLElement}
      />
    </Sender.Header>
  );

  return (
    <Flex style={{ minHeight: '250px' }} align="flex-end">
      <Sender
        ref={senderRef}
        header={senderHeader}
        prefix={
          <Badge dot={(items.value?.length ?? 0) > 0 && !open.value}>
            <Dropdown
              trigger={['click']}
              menu={{ items: acceptItems, onClick: selectFile }}
              placement="topLeft"
              arrow={{ pointAtCenter: true }}
            >
              <Button
                disabled={(items.value?.length ?? 0) >= MAX_COUNT}
                type="text"
                icon={<LinkOutlined />}
              />
            </Dropdown>
          </Badge>
        }
        value={text.value}
        onChange={(v: string) => (text.value = v)}
        onSubmit={() => {
          notification.info({
            message: 'Mock Submit',
            description: (
              <Typography>
                <ul>
                  <li>You said: {text.value}</li>
                  <li>
                    Attachments count: {items.value?.length ?? 0}
                    <ul>
                      {(items.value ?? []).map((item: any) => (
                        <li key={item.uid}>{item.name}</li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </Typography>
            ),
          });
          items.value = [];
          text.value = '';
        }}
      />
    </Flex>
  );
};

defineRender(() => (
  <App>
    <Demo />
  </App>
));
</script>

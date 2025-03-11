<script setup lang="tsx">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex, Switch } from 'ant-design-vue';
import { Sender, Attachments } from 'ant-design-x-vue';
import { ref, computed, useTemplateRef } from 'vue';

defineOptions({ name: 'AXAttachmentBasic' });

const Demo = () => {
  const { message } = App.useApp();

  const fullScreenDrop = ref(false);
  const customContent = ref(true);
  const divRef = useTemplateRef<HTMLDivElement>('basic-container');

  const triggerFullScreenDrop = (v: boolean) => {
    fullScreenDrop.value = v
  }
  const triggerCustomContent = (v: boolean) => {
    customContent.value = v
  }

  const attachmentsNode = computed(() => (
    <Attachments
      beforeUpload={() => false}
      onChange={({ file }) => {
        message.info(`Mock upload: ${file.name}`);
      }}
      getDropContainer={() => (fullScreenDrop.value ? document.body : divRef.value)}
      placeholder={{
        icon: <CloudUploadOutlined />,
        title: 'Drag & Drop files here',
        description: 'Support file type: image, video, audio, document, etc.',
      }}
      children={customContent.value && <Button type="text" icon={<LinkOutlined />} />}
    />));

  return (
    <div ref="basic-container">
      <Flex vertical gap="middle" align="flex-start">
        <Sender prefix={attachmentsNode.value} />
        <Switch
          checked={fullScreenDrop.value}
          onChange={(checked) => {
            triggerFullScreenDrop(checked as boolean)
          }}
          checkedChildren="Full screen drop"
          unCheckedChildren="Full screen drop"
        />
        <Switch
          checked={customContent.value}
          onChange={(checked) => {
            triggerCustomContent(checked as boolean)
          }}
          checkedChildren="use default content"
          unCheckedChildren="custom content"
        />
      </Flex>
    </div>
  )
}

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  )
});
</script>

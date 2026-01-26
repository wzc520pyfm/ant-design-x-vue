<script setup lang="tsx">
import { ref } from 'vue';
import { EditOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions } from 'ant-design-x-vue';
import { Avatar, Flex } from 'ant-design-vue';

const editable = ref<[boolean, { editing: boolean; okText: string; cancelText: any }]>([
  false,
  { editing: false, okText: 'ok', cancelText: <span>cancel</span> },
]);
const content = ref(['editable bubble 1', 'editable bubble 2']);

defineRender(() => (
  <Flex vertical gap="small" style={{ minHeight: '200px' }}>
    <Flex>
      <Bubble
        editable={editable.value[0]}
        content={content.value[0]}
        avatar={<Avatar icon={<UserOutlined />} />}
        footer={
          <Actions
            items={[
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'edit',
              },
            ]}
            onClick={({ key }) => (editable.value = [key === 'edit', editable.value[1]])}
          />
        }
        onEditCancel={() => (editable.value = [false, editable.value[1]])}
        onEditConfirm={(val: string) => {
          content.value = [val, content.value[1]];
          editable.value = [false, editable.value[1]];
        }}
      />
    </Flex>
    <Flex>
      <Bubble
        style={{ width: '100%' }}
        placement="end"
        editable={editable.value[1]}
        content={content.value[1]}
        avatar={<Avatar icon={<UserOutlined />} />}
        footer={
          <Actions
            items={[
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'edit',
              },
            ]}
            onClick={({ key }) =>
              (editable.value = [editable.value[0], { ...editable.value[1], editing: key === 'edit' }])
            }
          />
        }
        onEditCancel={() => (editable.value = [editable.value[0], { ...editable.value[1], editing: false }])}
        onEditConfirm={(val: string) => {
          content.value = [content.value[0], val];
          editable.value = [editable.value[0], { ...editable.value[1], editing: false }];
        }}
      />
    </Flex>
  </Flex>
));
</script>

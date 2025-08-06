<script setup lang="tsx">
import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import { Button, Flex, Image } from 'ant-design-vue';
import { ref, type VNode } from 'vue';

type ContentType = {
  imageUrl: string;
  text: string;
  actionNode: VNode;
};

defineOptions({ name: 'AXBubbleCustomContent' });

const contentState = ref<ContentType>({
  imageUrl:
    'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
  text: 'Ant Design X Vue',
  actionNode: <>Click Me</>,
});

defineRender(() => {
  return (
    <div style={{ height: '100px' }}>
      <Bubble<ContentType>
        typing
        content={contentState.value}
        messageRender={(content) => {
          return (
            <Flex gap="middle" align="center">
              <Image height={50} src={content.imageUrl} />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{content.text}</span>
            </Flex>
          );
        }}
        avatar={{ icon: <UserOutlined /> }}
        footer={(content) => {
          return (
            <Button
              onClick={() => {
                contentState.value = {
                  ...contentState.value,
                  actionNode: <>🎉 Happy Ant Design X Vue !</>,
                }
              }}
              type="text"
            >
              {content?.actionNode}
            </Button>
          );
        }}
      />
    </div>
  );
});
</script>

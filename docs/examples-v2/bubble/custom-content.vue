<script setup lang="tsx">
defineOptions({ name: 'AXBubbleCustomContentV2' });

import { ref } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { Button, Flex, Image } from 'ant-design-vue';

type ContentType = {
  imageUrl: string;
  text: string;
  actionNode: any;
};

const content = ref<ContentType>({
  imageUrl:
    'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
  text: 'Ant Design X',
  actionNode: <>Click Me</>,
});

defineRender(() => (
  <div style={{ height: '100px' }}>
    <Bubble
      content={content.value}
      contentRender={(c) => {
        return (
          <Flex gap="middle" align="center">
            <Image height={50} src={(c as ContentType).imageUrl} />
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{(c as ContentType).text}</span>
          </Flex>
        );
      }}
      footer={(c) => {
        return (
          <Button
            onClick={() => {
              content.value = {
                ...content.value,
                actionNode: <>🎉 Happy Ant Design X !</>,
              };
            }}
            type="text"
          >
            {(c as ContentType)?.actionNode}
          </Button>
        );
      }}
    />
  </div>
));
</script>

<script setup lang="tsx">
import { App, Button, Flex } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXSenderFocus' });

const senderRef = ref<InstanceType<typeof Sender> | null>(null);

const Demo = () => {
  const senderProps = {
    defaultValue: 'Hello, welcome to use Ant Design X!',
    ref: senderRef,
  };

  return (
    <Flex wrap={'wrap'} gap={12} >
      <Button
        onClick={
          () => {
            senderRef.value?.focus({
              cursor: 'start',
            });
          }
        }
      >
        Focus at first
      </Button>
      <Button
        onClick={() => {
          senderRef.value?.focus({
            cursor: 'end',
          });
        }}
      >
        Focus at last
      </Button>
      <Button
        onClick={() => {
          senderRef.value?.focus({
            cursor: 'all',
          });
        }}
      >
        Focus to select all
      </Button>
      <Button
        onClick={() => {
          senderRef.value?.focus({
            preventScroll: true,
          });
        }}
      >
        Focus prevent scroll
      </Button>
      <Button
        onClick={() => {
          senderRef.value?.blur();
        }}
      >
        Blur
      </Button>
      <Sender {...senderProps} />
    </Flex>
  );
};

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  )
});

</script>

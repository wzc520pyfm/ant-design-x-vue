<script setup lang="tsx">
defineOptions({ name: 'AXSenderRefActionV2' });

import { ref } from 'vue';
import { Sender } from 'ant-design-x-vue';
import { Button, Flex } from 'ant-design-vue';

const senderRef = ref<InstanceType<typeof Sender> | null>(null);

defineRender(() => (
  <Flex wrap="wrap" gap={12}>
    <Button onClick={() => { senderRef.value!.insert('some text'); }}>
      Insert Text
    </Button>
    <Button onClick={() => { senderRef.value!.insert('some text', 'end'); }}>
      Insert Text End
    </Button>
    <Button onClick={() => { senderRef.value!.insert('some text', 'start'); }}>
      Insert Text Start
    </Button>
    <Button onClick={() => { senderRef.value!.focus({ cursor: 'start' }); }}>
      Focus at first
    </Button>
    <Button onClick={() => { senderRef.value!.focus({ cursor: 'end' }); }}>
      Focus at last
    </Button>
    <Button onClick={() => { senderRef.value!.focus({ cursor: 'all' }); }}>
      Focus to select all
    </Button>
    <Button onClick={() => { senderRef.value!.focus({ preventScroll: true }); }}>
      Focus prevent scroll
    </Button>
    <Button onClick={() => { senderRef.value!.blur(); }}>
      Blur
    </Button>
    <Sender ref={senderRef} defaultValue="Hello, welcome to use Ant Design X!" />
  </Flex>
));
</script>

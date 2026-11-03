<script setup lang="tsx">
defineOptions({ name: 'AXSdkXRequestCustomTransformerV2' });

import { computed, ref } from 'vue';
import { TagsOutlined } from '@ant-design/icons-vue';
import { Button, Flex } from 'ant-design-vue';
import { ThoughtChain, XRequest, type ThoughtChainItemType } from 'ant-design-x-vue';
import { createMockNdjsonFetch } from '../../_shared/mock-chat';

const BASE_URL = 'https://mock.local';
const PATH = '/chat';
const ND_JSON_SEPARATOR = '\n';

const ndJsonData = `{data:{"id":"0","choices":[{"index":0,"delta":{"content":"Hello","role":"assistant"}}],"created":1733129200,"model":"gpt-4o"}}
{data:{"id":"1","choices":[{"index":1,"delta":{"content":"world!","role":"assistant"}}],"created":1733129300,"model":"gpt-4o"}}
{data:{"id":"2","choices":[{"index":2,"delta":{"content":"I","role":"assistant"}}],"created":1733129400,"model":"gpt-4o"}}
{data:{"id":"3","choices":[{"index":3,"delta":{"content":"am","role":"assistant"}}],"created":1733129500,"model":"gpt-4o"}}
{data:{"id":"4","choices":[{"index":4,"delta":{"content":"Ant Design X!","role":"assistant"}}],"created":1733129600,"model":"gpt-4o"}}`;

const status = ref<ThoughtChainItemType['status']>();
const lines = ref<string[]>([]);
const busy = ref(false);

function request() {
  busy.value = true;
  status.value = 'loading';
  lines.value = [];
  XRequest(BASE_URL + PATH, {
    params: {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
      agentId: 111,
    },
    callbacks: {
      onSuccess: () => {
        status.value = 'success';
        busy.value = false;
      },
      onError: () => {
        status.value = 'error';
        busy.value = false;
      },
      onUpdate: (msg) => {
        lines.value = [...lines.value, String(msg)];
      },
    },
    transformStream: new TransformStream<string, string>({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    }),
    fetch: createMockNdjsonFetch(ndJsonData.split(ND_JSON_SEPARATOR)),
  });
}

const items = computed(() => [
  {
    key: 'log',
    title: 'Mock Custom Protocol - Log',
    status: status.value,
    icon: <TagsOutlined />,
    content: (
      <pre style={{ overflow: 'auto', margin: 0 }}>
        <code>{lines.value.join(ND_JSON_SEPARATOR)}</code>
      </pre>
    ),
  },
]);

defineRender(() => (
  <Flex vertical gap={16} align="flex-start">
    <Button type="primary" disabled={busy.value} onClick={request}>
      Request - {BASE_URL}{PATH}
    </Button>
    <ThoughtChain items={status.value ? items.value : []} />
  </Flex>
));
</script>

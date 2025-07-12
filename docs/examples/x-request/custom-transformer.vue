<script setup lang="tsx">
import { TagsOutlined } from '@ant-design/icons-vue';
import { Button, Flex } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainItem, XRequest } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXXRequestCustomTransformer' });

const BASE_URL = 'https://api.example.host';
const PATH = '/chat';
const MODEL = 'gpt-4o';

const ND_JSON_SEPARATOR = '\n';

async function mockFetch() {
  const ndJsonData = `{data:{"id":"0","choices":[{"index":0,"delta":{"content":"Hello","role":"assistant"}}],"created":1733129200,"model":"gpt-4o"}}
{data:{"id":"1","choices":[{"index":1,"delta":{"content":"world!","role":"assistant"}}],"created":1733129300,"model":"gpt-4o"}}
{data:{"id":"2","choices":[{"index":2,"delta":{"content":"I","role":"assistant"}}],"created":1733129400,"model":"gpt-4o"}}
{data:{"id":"3","choices":[{"index":3,"delta":{"content":"am","role":"assistant"}}],"created":1733129500,"model":"gpt-4o"}}
{data:{"id":"4","choices":[{"index":4,"delta":{"content":"Ant Design X!","role":"assistant"}}],"created":1733129600,"model":"gpt-4o"}}`;

  const chunks = ndJsonData.split(ND_JSON_SEPARATOR);

  const response = new Response(
    new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      },
    }),
    {
      headers: {
        'Content-Type': 'application/x-ndjson',
      },
    },
  );

  return response;
}

const exampleRequest = XRequest({
  baseURL: BASE_URL + PATH,
  model: MODEL,
  fetch: mockFetch,
});

const status = ref<ThoughtChainItem['status']>();
const lines = ref<string[]>([]);

async function request() {
  status.value = 'pending';

  await exampleRequest.value.create(
    {
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
    },
    {
      onSuccess: (messages) => {
        status.value = 'success';
        console.log('onSuccess', messages);
      },
      onError: (error) => {
        status.value = 'error';
        console.error('onError', error);
      },
      onUpdate: (msg) => {
        lines.value = [...lines.value, msg];
        console.log('onUpdate', msg);
      },
    },
    new TransformStream < string, string > ({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    }),
  );
}

defineRender(() => {
  return (
    <Flex align="start" gap={16} style={{ overflow: 'auto' }}>
      <Button type="primary" disabled={status.value === 'pending'} onClick={request}>
        Request - {BASE_URL}
        {PATH}
      </Button>
      <ThoughtChain
        items={[
          {
            title: 'Mock Custom Protocol - Log',
            status: status.value,
            icon: <TagsOutlined />,
            content: (
              <pre style={{ overflow: 'scroll' }}>
                <code>{lines.value.join(ND_JSON_SEPARATOR)}</code>
              </pre>
            ),
          },
        ]}
      />
    </Flex>
  )
});
</script>

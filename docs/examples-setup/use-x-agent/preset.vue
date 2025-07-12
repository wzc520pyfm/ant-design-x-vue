<script setup lang="ts">
import { LoadingOutlined, TagsOutlined } from '@ant-design/icons-vue';
import { Button, Descriptions, Flex } from 'ant-design-vue';
import {
  ThoughtChain,
  useXAgent,
  type ThoughtChainItem,
} from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXUseXAgentPresetSetup' });

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
const BASE_URL = 'https://api.example.com';
const PATH = '/chat';
const MODEL = 'gpt-3.5-turbo';
/** 🔥🔥 Its dangerously! */
// const API_KEY = '';

interface YourMessageType {
  role: string;
  content: string;
}

const status = ref<ThoughtChainItem['status']>();
const lines = ref<Record<string, string>[]>([]);

const [agent] = useXAgent<YourMessageType>({
  baseURL: BASE_URL + PATH,
  model: MODEL,
  // dangerouslyApiKey: API_KEY
});

async function request() {
  status.value = 'pending';

  agent.value.request(
    {
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
    },
    {
      onSuccess: (chunks) => {
        status.value = 'success';
        console.log('onSuccess', chunks);
      },
      onError: (error) => {
        status.value = 'error';
        console.error('onError', error);
      },
      onUpdate: (chunk) => {
        lines.value = [...lines.value, chunk];
        console.log('onUpdate', chunk);
      },
    },
  );
}
</script>

<template>
  <Flex
    align="start"
    :gap="16"
    :style="{ overflow: 'auto' }"
  >
    <div>
      <Button
        type="primary"
        :disabled="status === 'pending'"
        @click="request"
      >
        Agent Request
      </Button>
    </div>
    <div>
      <ThoughtChain
        :style="{ marginLeft: 16 }"
        :items="[
          {
            title: 'Agent Request Log',
            status: status,
            icon: status === 'pending' ? h(LoadingOutlined) : h(TagsOutlined),
            description:
              status === 'error' &&
              agent.config.baseURL === BASE_URL + PATH &&
              'Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.',
            content: h(Descriptions, { column: 1 }, () => [
              h(
                Descriptions.Item,
                {
                  label: 'Status',
                },
                () => status || '-',
              ),
              h(
                Descriptions.Item,
                {
                  label: 'Update Times',
                },
                () => lines.length,
              ),
            ]),
          },
        ]"
      />
    </div>
  </Flex>
</template>

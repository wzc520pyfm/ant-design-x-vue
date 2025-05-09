<script setup lang="ts">
import { Button, Divider, Form, Input, Typography } from 'ant-design-vue';
import { useXAgent } from 'ant-design-x-vue';
import { reactive, ref, watch } from 'vue';

defineOptions({ name: 'AXUseXAgentCustomSetup' });

const lines = ref<string[]>([]);

const modelRef = reactive({
  question: '',
});

Form.useForm(modelRef);

const log = (text: string) => {
  lines.value = [...lines.value, text];
};

const [ agent ] = useXAgent({
  request: ({ message }, { onUpdate, onSuccess }) => {
    let times = 0;

    const id = setInterval(() => {
      times += 1;
      onUpdate(`Thinking...(${times}/3)`);

      if (times >= 3) {
        onSuccess(`It's funny that you ask: ${message}`);
        clearInterval(id);
      }
    }, 500);
  },
});

const onFinish = ({ question }: { question: string }) => {
  log(`[You] Ask: ${question}`);
  agent.value.request(
    { message: question },
    {
      onUpdate: (message) => {
        log(`[Agent] Update: ${message}`);
      },
      onSuccess: (message) => {
        log(`[Agent] Answer: ${message}`);
        modelRef.question = ''
      },
      // Current demo not use error
      onError: () => { },
    },
  );
};

const requesting = ref(false);

watch(() => agent.value.isRequesting(), () => {
  requesting.value = agent.value.isRequesting();
});

</script>
<template>
  <Form
    :model="modelRef"
    layout="vertical"
    auto-complete="off"
    @finish="onFinish"
  >
    <Form.Item
      label="Question"
      name="question"
    >
      <Input v-model:value="modelRef.question" />
    </Form.Item>
    <Form.Item>
      <Button
        html-type="submit"
        type="primary"
        :loading="requesting"
      >
        submit
      </Button>
    </Form.Item>
  </Form>

  <Divider />

  <Typography>
    <ul :style="{listStyle: 'circle', paddingLeft: 0 }">
      <li
        v-for="(line, index) in lines"
        :key="index"
      >
        {{ line }}
      </li>
    </ul>
  </Typography>
</template>

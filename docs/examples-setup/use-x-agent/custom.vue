<script setup lang="ts">
import { Button, Divider, Form, Input, Typography } from 'ant-design-vue';
import { useXAgent } from 'ant-design-x-vue';
import { reactive, ref, watch } from 'vue';

type OutputType = string;
type InputType = { message: string };

defineOptions({ name: 'AXUseXAgentCustomSetup' });

const lines = ref<string[]>([]);

const modelRef = reactive({
  question: '',
});

Form.useForm(modelRef);

const log = (text: string) => {
  lines.value = [...lines.value, text];
};

const [ agent ] = useXAgent<string, InputType, OutputType>({
  request: ({ message }, { onUpdate, onSuccess }) => {
    let times = 0;
    const chunks: OutputType[] = [];
    const id = setInterval(() => {
      times += 1;
      const chunk = `Thinking...(${times}/3)`;
      onUpdate(chunk);
      chunks.push(chunk);

      if (times >= 3) {
        onUpdate(`It's funny that you ask: ${message}`);
        onSuccess(chunks);
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
      onUpdate: (chunk) => {
        log(`[Agent] Update: ${chunk}`);
      },
      onSuccess: (chunks) => {
        log(`[Agent] Answer: ${chunks.join(',')}`);
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

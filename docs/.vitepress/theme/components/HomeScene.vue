<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { Bubble, Prompts, Sender, Welcome } from 'ant-design-x-vue'

const props = defineProps<{
  kind: 'independent' | 'assistant' | 'nest'
}>()

const questions = [
  'Ant Design X 全新升级了什么?',
  'Ant Design X 推出全新 RICH 设计规范',
  'Ant Design X 组件资产有哪些?',
  '快来了解全新AI时代的设计范式!',
]

const draft = ref(questions[0])
const lines = ref<{ id: number, role: 'user' | 'ai', text: string }[]>([])
let timer: ReturnType<typeof setInterval> | null = null
let seq = 0

function stop() {
  if (timer) clearInterval(timer)
  timer = null
}

function ask(query: string) {
  stop()
  const text = query.trim()
  if (!text) return
  lines.value.push({ id: ++seq, role: 'user', text })
  const answer = `已收到。你说的是：${text}`
  const id = ++seq
  lines.value.push({ id, role: 'ai', text: '' })
  let cursor = 0
  timer = setInterval(() => {
    cursor += 2
    const target = lines.value.find((item) => item.id === id)
    if (!target) return stop()
    target.text = answer.slice(0, cursor)
    if (cursor >= answer.length) stop()
  }, 24)
  draft.value = ''
}

watch(() => props.kind, () => {
  stop()
  lines.value = []
  draft.value = questions[0]
})

onBeforeUnmount(stop)

const promptItems = [
  {
    key: 'hot',
    label: '热门话题',
    children: questions.map((text, index) => ({
      key: `q-${index}`,
      description: text,
    })),
  },
]
</script>

<template>
  <div class="stage" :class="kind">
    <div v-if="kind === 'nest'" class="nest">
      <p>你好, 我是 Ant Design X</p>
      <Sender
        :value="draft"
        class="nest-sender"
        @change="(value: string) => draft = value"
        @submit="ask"
      />
    </div>
    <div v-else class="chat" :class="{ side: kind === 'assistant' }">
      <div class="thread">
        <div class="hello">
          <Welcome
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title="你好, 我是全新 AI 产品创造助手"
            description="基于 Ant Design 的 AGI 产品智能解决方案, 创造更美好的智能视界"
          />
          <Prompts
            :items="promptItems"
            @item-click="(info: { data?: { description?: string } }) => ask(String(info?.data?.description || ''))"
          />
        </div>
        <Bubble
          v-for="line in lines"
          :key="line.id"
          :content="line.text"
          :placement="line.role === 'user' ? 'end' : 'start'"
        />
      </div>
      <Sender
        :value="draft"
        placeholder="Ant Design X 全新升级了什么?"
        @change="(value: string) => draft = value"
        @submit="ask"
      />
    </div>
  </div>
</template>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
  min-height: 480px;
  color: #fff;
}

.chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 480px;
  padding: 20px 8px 12px;
}

.chat.side {
  width: min(420px, 100%);
  margin-left: auto;
  background: rgba(0, 0, 0, 0.16);
  border-radius: 16px;
}

.thread {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow: auto;
}

.hello {
  padding: 8px 12px 0;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 14%, rgba(255, 255, 255, 0.05) 59%);
}

.nest {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  height: 100%;
  min-height: 480px;
}

.nest p {
  margin: 0;
  color: rgba(255, 255, 255, 0.25);
  font-size: 42px;
  font-weight: 500;
  animation: drift 4.8s ease-in-out infinite;
}

.nest-sender {
  width: min(580px, 100%);
}

@keyframes drift {
  0%, 100% { transform: translateY(0); opacity: 0.35; }
  50% { transform: translateY(-6px); opacity: 0.55; }
}
</style>

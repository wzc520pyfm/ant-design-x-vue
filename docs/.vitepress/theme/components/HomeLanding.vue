<script setup lang="ts">
const steps = [
  { index: '1', name: '唤醒', text: '让第一次打开的人知道 AI 能做什么。', href: '/component/welcome' },
  { index: '2', name: '表达', text: '把意图说清楚，并看见自己发出去的内容。', href: '/component/sender' },
  { index: '3', name: '确认', text: '看见任务正在怎么跑，等待时仍有掌控感。', href: '/component/think' },
  { index: '4', name: '反馈', text: '看清结果，并能直接拿去用。', href: '/component/actions' },
]

const scenes = [
  { title: 'Web 独立式', text: '以自然语言为主，几乎不用点界面。', href: '/playground/independent' },
  { title: 'Web 助手式', text: '对话和界面操作一起用。', href: '/playground/copilot' },
  { title: 'Web 现代感', text: '同一套组件换一种更轻的布局。', href: '/playground/ultramodern' },
  { title: '百宝箱', text: '接一个智能体，而不是只接聊天模型。', href: '/playground/agent-tbox' },
]

const rich = [
  { name: 'Role 角色', href: '/design/role-design', text: 'AI 对外是谁，语气和能力边界是什么。' },
  { name: 'Intention 意图', href: '/design/intention-introduce', text: '用户想完成什么，以及怎么被引导说出来。' },
  { name: 'Conversation 会话', href: '/design/conversation-design', text: '从开场、追问到结束的一轮对话。' },
  { name: 'Hybrid UI', href: '/design/hybrid-ui-design', text: '图形界面和自然会话叠在同一次交互里。' },
]
</script>

<template>
  <div class="home-landing">
    <section class="hero">
      <p class="kicker">Ant Design X</p>
      <h1>AI 体验新秩序</h1>
      <p class="lead">
        Ant Design 的 RICH 设计范式，在 Vue 里做成可组合的界面。对话气泡、输入、思维链和流式 Markdown 使用同一套组件。
      </p>
      <div class="hero-actions">
        <a class="btn primary" href="/component/overview">开始使用</a>
        <a class="btn ghost" href="/design/introduce">设计语言</a>
      </div>
    </section>

    <section class="block">
      <h2>AI 设计范式 - RICH</h2>
      <p class="sub">
        角色、意图、会话、混合界面。Vue 文档保留这四组栏目，长文仍以 React 设计站为准，这里写的是和组件对应的入口。
      </p>
      <div class="grid four">
        <a v-for="item in rich" :key="item.href" class="card" :href="item.href">
          <strong>{{ item.name }}</strong>
          <span>{{ item.text }}</span>
        </a>
      </div>
    </section>

    <section class="block">
      <h2>AI 界面解决方案</h2>
      <p class="sub">从唤醒到反馈，组件按交互阶段分组，和 React 组件总览同一套顺序。</p>
      <div class="grid four">
        <a v-for="step in steps" :key="step.href" class="card step" :href="step.href">
          <em>{{ step.index }}</em>
          <strong>{{ step.name }}</strong>
          <span>{{ step.text }}</span>
        </a>
      </div>
    </section>

    <section class="block">
      <h2>试一试，多种 AI 场景</h2>
      <p class="sub">样板间直接跑在文档里。没有单独的 App 模板，移动端场景仍看组件本身。</p>
      <div class="grid four">
        <a v-for="scene in scenes" :key="scene.href" class="card" :href="scene.href">
          <strong>{{ scene.title }}</strong>
          <span>{{ scene.text }}</span>
        </a>
      </div>
    </section>

    <section class="block ecosystem">
      <h2>同一条产品线</h2>
      <div class="links">
        <a href="/component/overview">组件</a>
        <a href="/x-markdown/introduce">X Markdown</a>
        <a href="/x-sdk/introduce">X SDK</a>
        <a href="https://x.ant.design/index-cn" target="_blank" rel="noreferrer">Ant Design X of React</a>
        <a href="https://www.antdv.com/components/overview-cn" target="_blank" rel="noreferrer">Ant Design Vue</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-landing {
  padding: 48px 8vw 72px;
  color: var(--vp-c-text-1);
}

.hero {
  min-height: 62vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 24px 0 72px;
}

.kicker {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.03em;
}

h1 {
  margin: 0;
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.12;
  font-weight: 600;
  letter-spacing: -0.04em;
  border: none;
}

.lead {
  max-width: 560px;
  margin: 18px 0 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.btn {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 22px;
  border-radius: 22px;
  font-size: 15px;
  text-decoration: none;
}

.btn.primary {
  background: #f2f3f5;
  color: #1f1f1f;
}

.dark .btn.primary {
  background: #f5f5f5;
  color: #141414;
}

.btn.ghost {
  background: rgba(127, 127, 127, 0.25);
  color: var(--vp-c-text-1);
}

.block {
  padding: 48px 0 12px;
}

.block h2 {
  margin: 0 0 8px;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.03em;
  border: none;
  text-align: center;
}

.sub {
  max-width: 720px;
  margin: 0 auto 28px;
  text-align: center;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.grid {
  display: grid;
  gap: 16px;
}

.grid.four {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 140px;
  padding: 20px;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.card strong {
  font-size: 16px;
}

.card span,
.card em {
  color: var(--vp-c-text-2);
  font-style: normal;
  line-height: 1.6;
  font-size: 14px;
}

.step em {
  color: var(--x-pill-active, #1677ff);
  font-weight: 600;
}

.ecosystem .links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 20px;
}

.ecosystem a {
  color: var(--vp-c-text-1);
}

@media (max-width: 1100px) {
  .grid.four {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .home-landing {
    padding: 24px 20px 48px;
  }

  .grid.four {
    grid-template-columns: 1fr;
  }
}
</style>

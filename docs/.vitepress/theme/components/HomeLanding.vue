<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { theme, Welcome, Prompts, Bubble, XProvider } from 'ant-design-x-vue'
import LottieBox from './LottieBox.vue'
import HomeScene from './HomeScene.vue'

const comma = '\u00A0,\u00A0\u00A0'
const stages = [
  {
    label: '唤醒',
    title: `轻松唤醒${comma}即刻吸引`,
    desc: '可以让首次接触的用户快速理解AI能做什么, 告知用户AI可实现的意图范围, 降低用户成本',
    action: '从唤醒开始',
    href: '/component/welcome',
    icon: 'https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/f14LTKOFxRsAAAAAQbAAAAgADtFMAQFr/original',
    start: '#6fb3e2',
    end: '#6c57ff',
  },
  {
    label: '表达',
    title: `简单表达${comma}随时反馈`,
    desc: '让用户知道如何快捷且正确的表达意图, 减少AI的不理解风险, 看清自己发送的内容',
    action: '从表达开始',
    href: '/component/attachments',
    icon: 'https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/dGfqSaM9ZxoAAAAAQaAAAAgADtFMAQFr/original',
    start: '#6dd6f5',
    end: '#108c44',
  },
  {
    label: '确认',
    title: `过程确认${comma}尽在掌握`,
    desc: '让用户知道该任务的AI执行运转情况, 缓解用户等待焦虑, 有掌控感',
    action: '从确认开始',
    href: '/component/think',
    icon: 'https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/BQaCTIUU-CkAAAAAQZAAAAgADtFMAQFr/original',
    start: '#ba2cb8',
    end: '#6c37e8',
  },
  {
    label: '反馈',
    title: `结果反馈${comma}谁能不信`,
    desc: '让用户清晰看到并信任AI任务完成的情况, 并快速应用AI生成结果',
    action: '从反馈开始',
    href: '/component/actions',
    icon: 'https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/r-DuSZG-9NIAAAAAQdAAAAgADtFMAQFr/original',
    start: '#f7c348',
    end: '#f75972',
  },
]

const scenes = [
  {
    key: 'independent',
    title: 'Web 独立式',
    desc: '自然语言为主 , 几乎没有界面操作',
    href: '/playground/independent',
    img: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*YVjbTqbc7ngAAAAAAAAAAAAADgCCAQ/fmt.avif',
  },
  {
    key: 'assistant',
    title: 'Web 助手式',
    desc: '自然语言和界面操作均衡配合使用',
    href: '/playground/copilot',
    img: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*kCojRo0SoAAAAAAAAAAAAAAADgCCAQ/fmt.avif',
  },
  {
    key: 'nest',
    title: 'Web 嵌入式',
    desc: '界面操作为主 , 偶尔唤起AI指令',
    img: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*krfsT5zBSuUAAAAAAAAAAAAADgCCAQ/fmt.avif',
  },
  {
    key: 'app',
    title: 'App 端',
    desc: '疯狂研发中 , 敬请期待',
    disabled: true,
  },
]

const sceneKey = ref('independent')
const activeScene = computed(() => scenes.find((item) => item.key === sceneKey.value))

const darkTheme = { algorithm: theme.darkAlgorithm, inherit: false }

const promptItems = [
  {
    key: '1',
    label: '🎉 你好, 我是全新 AI 产品创造助手',
    description: '基于 Ant Design 的 AGI 产品智能解决方案, 创造更美好的智能视界',
    children: [
      { key: '1-1', description: 'Ant Design X 全新升级了什么? ' },
      { key: '1-2', description: '快来了解全新AI时代的设计范式! ' },
    ],
  },
]

let direction = 1
function onBackgroundLoad(animation: { addEventListener: Function, setDirection: Function, setSpeed: Function, play: Function }) {
  animation.addEventListener('complete', () => {
    direction = direction === -1 ? 1 : -1
    animation.setDirection(direction)
    animation.setSpeed(0.6)
    animation.play()
  })
}

function onForegroundLoad(animation: { addEventListener: Function, loop: boolean, setSpeed: Function, playSegments: Function }) {
  animation.addEventListener('complete', () => {
    animation.loop = true
    animation.setSpeed(0.7)
    animation.playSegments([100, 150], false)
  })
}

let richPlayed = false
let richAnimation: { goToAndPlay: (frame: number, isFrame: boolean) => void } | null = null
function onRichLoad(animation: {
  play: () => void
  loop: boolean
  goToAndStop: (frame: number, isFrame: boolean) => void
  goToAndPlay: (frame: number, isFrame: boolean) => void
  addEventListener: (name: string, cb: () => void) => void
}) {
  richAnimation = animation
  animation.goToAndStop(120, true)
  animation.addEventListener('complete', () => {
    animation.goToAndStop(120, true)
  })
  playRich()
}
function playRich() {
  if (richPlayed || !richAnimation || window.scrollY <= 480) return
  richPlayed = true
  richAnimation.goToAndPlay(36, true)
}
function bindReveal() {
  const nodes = document.querySelectorAll('.home [data-reveal]')
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in')
    })
  }, { threshold: 0.18 })
  nodes.forEach((node) => io.observe(node))
}
onMounted(() => {
  window.addEventListener('scroll', playRich, { passive: true })
  bindReveal()
  playRich()
})
onUnmounted(() => window.removeEventListener('scroll', playRich))

function titleParts(title: string, label: string) {
  const parts = title.split(label)
  return { before: parts[0] || '', after: parts[1] || '' }
}
</script>

<template>
  <main class="home">
    <section class="banner">
      <LottieBox
        class="banner-bg"
        path="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*3QcuQpaOguQAAAAAAAAAAAAADgCCAQ"
        @load="onBackgroundLoad"
      />
      <div class="banner-inner">
        <div class="banner-copy">
          <h1 class="name">
            Ant Des<span class="i-letter">I<span class="i-star" /></span>gn X
          </h1>
          <h1 class="name">AI 体验新秩序</h1>
          <p class="desc">Ant Design 团队匠心呈现 RICH 设计范式，打造卓越 AI 界面解决方案，引领智能新体验。</p>
          <div class="banner-actions">
            <a class="pill start" href="/component/overview">开始使用</a>
            <a class="pill design" href="/design/introduce">设计语言</a>
          </div>
        </div>
        <LottieBox
          class="banner-fg"
          path="https://mdn.alipayobjects.com/huamei_lkxviz/afts/file/n25_R7prS_0AAAAAQPAAAAgADtFMAQFr"
          @load="onForegroundLoad"
        />
      </div>
    </section>

    <section class="sheet">
      <a class="block rich" href="/design/introduce">
        <h2>AI 设计范式 - RICH</h2>
        <p>我们致力于构建 AI 设计理论，并在蚂蚁内部海量 AI 产品中实践、迭代。在此过程中，RICH 设计范式应运而生：角色（Role）、意图（Intention）、会话（Conversation）和混合界面（Hybrid UI）</p>
        <LottieBox
          class="rich-lottie"
          :autoplay="false"
          path="https://mdn.alipayobjects.com/huamei_lkxviz/afts/file/nLaTTqe5cMAAAAAAQiAAAAgADtFMAQFr"
          @load="onRichLoad"
        />
      </a>
    </section>

    <section class="sheet overlap">
      <div class="block">
        <h2>AI 界面解决方案</h2>
        <p class="lead">基于RICH，延续熟悉的 Ant Design 设计语言，全新 AGI 混合界面（Hybrid-UI）解决方案，完美融合 GUI 和自然会话交互。从唤醒到表达，从过程到反馈，合适的组件恰当的呈现在所有的人机互动过程中。</p>
        <div class="chain">
          <div
            v-for="(item, index) in stages"
            :key="item.label"
            class="chain-item"
            data-reveal
            :style="{ transitionDelay: `${index * 80}ms` }"
          >
            <div class="chain-rail">
              <div class="chain-icon">
                <img :src="item.icon" alt="" />
                <img :src="item.icon" alt="" class="blur" />
              </div>
              <div
                v-if="index < stages.length - 1"
                class="chain-line"
                :style="{ backgroundImage: `linear-gradient(180deg, ${item.start}00 0%, ${item.start} 25%, ${item.end} 75%, ${item.end}00 100%)` }"
              />
            </div>
            <div class="chain-copy">
              <div class="chain-label"><span>{{ index + 1 }}.</span>{{ item.label }}</div>
              <div class="chain-title">
                <span>{{ titleParts(item.title, item.label).before }}</span>
                <span class="grad" :style="{ backgroundImage: `linear-gradient(127deg, ${item.start} 23%, ${item.end} 100%)` }">{{ item.label }}</span>
                <span>{{ titleParts(item.title, item.label).after }}</span>
              </div>
              <p>{{ item.desc }}</p>
              <a class="pill ghost" :href="item.href">{{ item.action }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sheet overlap">
      <div class="block">
        <h2>试一试 , 多种 AI 场景体验</h2>
        <p class="lead">提供多场景解决方案 , 帮助用户提高与 AI 协作效率</p>
        <div class="scenes" data-reveal>
          <div class="scene-tabs">
            <button
              v-for="item in scenes"
              :key="item.key"
              type="button"
              class="scene-tab"
              :class="{ active: sceneKey === item.key, disabled: item.disabled }"
              :disabled="item.disabled"
              @click="sceneKey = item.key"
            >
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </button>
          </div>
          <div v-if="activeScene && !activeScene.disabled" class="scene-stage">
            <HomeScene :kind="activeScene.key === 'assistant' ? 'assistant' : activeScene.key === 'nest' ? 'nest' : 'independent'" />
          </div>
        </div>
      </div>

      <div class="block">
        <h2>组件丰富 , 选用自如</h2>
        <p class="lead">Ant Design X 全新 AI 组件 , 大量实用组件满足你的需求 , 灵活定制与拓展</p>
          <XProvider :theme="darkTheme">
          <div class="cards" data-reveal>
            <a class="card" data-reveal href="/component/welcome">
              <div class="card-preview">
                <Welcome
                  style="width: 290px"
                  icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                  title="你好, 我是 Ant Design X"
                  description="基于 Ant Design 的 AGI 产品智能解决方案, 创造更美好的智能视界"
                />
              </div>
              <h3>欢迎组件 <em>唤醒</em></h3>
              <p>开箱即用、易于配置、极致体验的通用图表库</p>
            </a>
            <a class="card" href="/component/prompts">
              <div class="card-preview">
                <Prompts :items="promptItems" />
              </div>
              <h3>用户推荐 <em>唤醒</em></h3>
              <p>让首次接触AI产品的用户快速理解AI能做什么</p>
            </a>
            <a class="card" href="/component/suggestion">
              <div class="card-preview">
                <img alt="" src="https://mdn.alipayobjects.com/huamei_k0vkmw/afts/img/A*-c6EQ7U4-4oAAAAAAAAAAAAADsR-AQ/fmt.avif" />
              </div>
              <h3>快捷命令 <em>表达</em></h3>
              <p>开箱即用、易于配置、极致体验的通用图表库</p>
            </a>
            <a class="card" href="/component/bubble">
              <div class="card-preview">
                <img alt="" src="https://mdn.alipayobjects.com/huamei_k0vkmw/afts/img/A*WxlPTYGnviYAAAAAAAAAAAAADsR-AQ/fmt.avif" />
              </div>
              <h3>进度加载 <em>确认</em></h3>
              <p>开箱即用、易于配置、极致体验的通用图表库</p>
            </a>
            <a class="card" href="/component/actions">
              <div class="card-preview">
                <Bubble content="Ant Design X 全新升级了什么?" />
              </div>
              <h3>结果操作 <em>反馈</em></h3>
              <p>开箱即用、易于配置、极致体验的通用图表库</p>
            </a>
            <a class="card" href="/component/conversations">
              <div class="card-preview">
                <img alt="" src="https://mdn.alipayobjects.com/huamei_k0vkmw/afts/img/A*7nVeT7Qg-QoAAAAAAAAAAAAADsR-AQ/fmt.avif" />
              </div>
              <h3>管理对话 <em>通用</em></h3>
              <p>开箱即用、易于配置、极致体验的通用图表库</p>
            </a>
          </div>
        </XProvider>
      </div>
    </section>

    <section class="sheet framework">
      <div class="block">
        <h2>AI 设计语言与研发框架</h2>
        <p class="lead">配套生态 , 让你快速搭建网站应用</p>
        <div class="eco" data-reveal>
          <a href="/design/introduce">
            <img alt="" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*poTnSZrI7-oAAAAAAAAAAAAADgCCAQ/fmt.webp" />
            <strong>RICH 设计指南</strong>
            <span>意图、角色、会话、混合 UI</span>
          </a>
          <a href="/design/hybrid-ui-design">
            <img alt="" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Off_QYoo0GIAAAAAAAAAAAAADgCCAQ/fmt.webp" />
            <strong>组件设计指引</strong>
            <span>全局样式、设计模式</span>
          </a>
          <a href="/component/overview">
            <img alt="" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*AhrTT6K2vU0AAAAAAAAAAAAADgCCAQ/fmt.webp" />
            <strong>组件库</strong>
            <span>Ant Design of React / Angular / Vue</span>
          </a>
          <a href="https://ant.design/" target="_blank" rel="noreferrer">
            <img class="icon" alt="" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*dUzuRJes4pUAAAAAAAAAAAAADgCCAQ/original" />
            <strong>Ant Design</strong>
            <span>企业级 UI 设计语言和 React 组件库</span>
          </a>
          <a href="https://mobile.ant.design/" target="_blank" rel="noreferrer">
            <img class="icon" alt="" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rzh3RoWC9zAAAAAAAAAAAAAADgCCAQ/original" />
            <strong>Ant Design Mobile</strong>
            <span>Ant Design移动端 UI 组件库</span>
          </a>
          <a href="https://antv.vision/" target="_blank" rel="noreferrer">
            <img class="icon" alt="" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*9MFyQ77L6E4AAAAAAAAAAAAADgCCAQ/fmt.webp" />
            <strong>AntV</strong>
            <span>全新一代数据可视化解决方案</span>
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  color: rgba(255, 255, 255, 0.88);
  background: #0c0e10;
}

.banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 600px;
  height: calc(100vh - 160px);
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100vh;
  filter: blur(50px);
}

.banner-inner {
  position: relative;
  width: min(1200px, calc(100vw - 80px));
  height: 100%;
}

.banner-copy {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 1;
  max-width: 640px;
  transform: translateY(-50%);
}

.name {
  margin: 0;
  font-size: 80px;
  font-weight: 700;
  line-height: 1.3;
  color: #fff;
}

.i-letter {
  position: relative;
  display: inline-block;
  font-size: 60px;
}

.i-star {
  position: absolute;
  top: 0;
  left: 50%;
  width: 22px;
  height: 22px;
  background: no-repeat center url('https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*RMOpRLHgA9wAAAAAAAAAAAAADgCCAQ/original');
  background-size: cover;
  transform: translate(-50%, -50%);
}

.i-star::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, #fe8aff 0%, #fe8aff00 100%);
  filter: blur(12px);
}

.desc,
.lead {
  max-width: 500px;
  margin: 24px 0 48px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
}

.lead {
  max-width: 880px;
  margin: 0 auto 28px;
  text-align: center;
}

.banner-actions {
  display: flex;
  gap: 24px;
}

.pill {
  display: inline-flex;
  align-items: center;
  height: 56px;
  padding: 0 40px;
  border-radius: 40px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.pill.start {
  color: #14204c;
  background: linear-gradient(90deg, #c7deff 0%, #ffffffd9 76%);
}

.pill.design,
.pill.ghost {
  position: relative;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px);
}

.banner-fg {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 0;
  width: min(520px, 42vw);
  height: 420px;
  transform: translate(40px, -40%);
}

.sheet {
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 48px 0;
  border-radius: 40px 40px 0 0;
  background: linear-gradient(180deg, rgba(30, 34, 38, 0.9) 0%, #1c2024 38%, #16191c 100%);
  backdrop-filter: blur(40px);
}

.sheet.overlap {
  margin-top: -40px;
}

.sheet.framework {
  border-radius: 0;
  background-image: linear-gradient(90deg, #5a37e6 0%, #0059c9 100%);
}

.block {
  width: min(1200px, calc(100vw - 80px));
  margin: 0 auto;
}

.block h2,
.rich h2 {
  margin: 0 0 12px;
  color: #fff;
  font-size: 48px;
  line-height: 1.35;
  text-align: center;
  overflow: visible;
}

.rich {
  display: block;
  height: 720px;
  padding-top: 20px;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  scroll-margin-top: 96px;
}

.rich h2 {
  padding-top: 4px;
  line-height: 1.35;
}

.rich-lottie {
  width: 100%;
  height: 750px;
  margin-top: -40px;
}

.rich-lottie :deep(svg) {
  width: 100% !important;
  height: auto !important;
}

.chain {
  display: flex;
  flex-direction: column;
  max-width: 720px;
}

.chain-item {
  display: flex;
  gap: 24px;
}

.chain-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.chain-icon img {
  position: absolute;
  height: 40px;
}

.chain-icon .blur {
  filter: blur(18px);
}

.chain-line {
  width: 4px;
  height: 220px;
  margin: 0 auto;
}

.chain-label {
  font-size: 20px;
  font-weight: 700;
  line-height: 40px;
}

.chain-label span {
  padding-inline-end: 10px;
}

.chain-title {
  font-size: 38px;
  font-weight: 700;
  line-height: 56px;
}

.grad {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.chain-copy p {
  max-width: 520px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 16px;
  line-height: 32px;
}

.scenes {
  display: flex;
  gap: 32px;
  margin-top: 24px;
}

.scene-tabs {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 280px;
}

.scene-tab {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 86px;
  padding: 16px;
  border: none;
  border-radius: 20px;
  background: transparent;
  color: #fff;
  text-align: start;
  cursor: pointer;
}

.scene-tab.active {
  background: rgba(255, 255, 255, 0.1);
}

.scene-tab.disabled {
  color: rgba(255, 255, 255, 0.35);
  cursor: not-allowed;
}

.scene-tab span {
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
}

.scene-stage {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 520px;
  padding: 24px;
  border-radius: 16px;
  background: #0c0e10cc url('https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*RxJMSbQRvTUAAAAAAAAAAAAADgCCAQ/fmt.avif') center / cover no-repeat;
}

.scene-stage img {
  width: min(100%, 760px);
  border-radius: 12px;
}

[data-reveal] {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}

[data-reveal].in {
  opacity: 1;
  transform: none;
}

.card:hover,
.eco a:hover,
.scene-tab:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.16);
}

.chain-icon img:not(.blur) {
  animation: glow 2.8s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { filter: none; }
  50% { filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.45)); }
}

.cards,
.eco {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.card,
.eco a {
  display: block;
  padding: 20px;
  border-radius: 24px;
  background: rgba(12, 14, 16, 0.8);
  color: inherit;
  text-decoration: none;
}

.card-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  margin-bottom: 12px;
  overflow: hidden;
}

.card-preview img,
.eco img {
  max-width: 100%;
  max-height: 200px;
}

.eco img.icon {
  width: 48px;
  height: 48px;
}

.card h3,
.eco strong {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 6px;
  font-size: 18px;
}

.card em {
  background: linear-gradient(127deg, #6fb3e2 23%, #6c57ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-style: normal;
  font-size: 12px;
}

.card p,
.eco span {
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
}

.eco a {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 180px;
}

@media (max-width: 960px) {
  .name { font-size: 48px; }
  .banner-fg { display: none; }
  .banner-copy { width: 100%; text-align: center; }
  .cards, .eco, .scenes { grid-template-columns: 1fr; display: grid; }
  .scene-tabs { width: 100%; }
  .chain-title { font-size: 28px; line-height: 1.3; }
}
</style>

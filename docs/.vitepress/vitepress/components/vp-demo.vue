<script setup lang="ts">
import { computed, getCurrentInstance, ref, toRef } from 'vue'
import { isClient, useClipboard, useStorage, useToggle } from '@vueuse/core'
import { App, Divider, Tooltip, theme } from 'ant-design-vue'
import { XProvider } from 'ant-design-x-vue'
import { CaretUpFilled, CodepenOutlined, ThunderboltOutlined, FunctionOutlined } from '@ant-design/icons-vue'
// import { useLang } from '../composables/lang'
import { useSourceCode } from '../composables/source-code'
import { usePlayground } from '../composables/use-playground'
// import demoBlockLocale from '../../i18n/component/demo-block.json'
import SourceCode from './demo/vp-source-code.vue'
import { useData } from 'vitepress'

const props = defineProps<{
  source: string
  sourceSetup: string
  path: string
  rawSource: string
  rawSourceSetup: string
  description: string
  title: string
}>()

const vm = getCurrentInstance()!

const prefer = useStorage('antdx-docs-preference', 'tsx');

const { isDark } = useData()

const algorithm = computed(() => isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm)

const { copy, isSupported } = useClipboard({
  source: () => decodeURIComponent(prefer.value === 'tsx' ? props.rawSource : props.rawSourceSetup),
  read: false,
})

const [sourceVisible, toggleSourceVisible] = useToggle()
// const lang = useLang()
const demoSourceUrl = useSourceCode(toRef(props, 'path'))

const sourceCodeRef = ref<HTMLButtonElement>()

// const locale = computed(() => demoBlockLocale[lang.value])
const locale = computed(() => ({}));
const decodedDescription = computed(() => decodeURIComponent(props.description))
const { onStackblitzPlayBtnClick } = usePlayground({
  title: props.title,
  rawSource: () => prefer.value === 'tsx' ? props.rawSource : props.rawSourceSetup,
  path: props.path,
})

const onSourceVisibleKeydown = (e: KeyboardEvent) => {
  if (['Enter', 'Space'].includes(e.code)) {
    e.preventDefault()
    toggleSourceVisible(false)
    sourceCodeRef.value?.focus()
  }
}

const copyCode = async () => {
  const { $message } = vm.appContext.config.globalProperties
  if (!isSupported) {
    // $message.error(locale.value['copy-error'])
  }
  try {
    await copy()
    // $message.success(locale.value['copy-success'])
  } catch (e: any) {
    // $message.error(e.message)
  }
}
</script>

<template>
  <!-- danger here DO NOT USE INLINE SCRIPT TAG -->
  <div style="margin-top: 16px; margin-bottom: 16px;" v-html="decodedDescription" />

  <XProvider :theme="{
    algorithm,
  }">

    <div class="example">
      <div class="example-showcase">
        <template v-if="prefer === 'tsx'">
          <slot name="source" />
        </template>
        <template v-if="prefer === 'setup'">
          <slot name="source-setup" />
        </template>
      </div>

      <Divider style="margin: 0;" />

      <div class="op-btns">
        <Tooltip>
          <template #title>在 Stackblitz 中打开</template>
          <ThunderboltOutlined tabindex="0" role="link" class="op-btn" @click="onStackblitzPlayBtnClick"
            @keydown.prevent.enter="onStackblitzPlayBtnClick" @keydown.prevent.space="onStackblitzPlayBtnClick" />
        </Tooltip>
        <!-- <Tooltip>
        <template #title>在 CodePen 中打开</template>
        <CodepenOutlined
          tabindex="0"
          role="link"
          class="op-btn"
          @click="onPlaygroundClick"
          @keydown.prevent.enter="onPlaygroundClick"
          @keydown.prevent.space="onPlaygroundClick"
        />
      </Tooltip> -->
        <Tooltip>
          <template #title>查看源代码</template>
          <button ref="sourceCodeRef" :aria-label="sourceVisible ? '隐藏源代码' : '查看源代码'
            " class="op-btn" @click="toggleSourceVisible()">
            <FunctionOutlined />
          </button>
        </Tooltip>
      </div>

      <Transition name="fade-in-linear">
        <SourceCode :visible="sourceVisible" :source="prefer === 'tsx' ? source : sourceSetup" />
      </Transition>

      <Transition name="fade-in-linear">
        <div v-show="sourceVisible" class="example-float-control" tabindex="0" role="button"
          @click="toggleSourceVisible(false)" @keydown="onSourceVisibleKeydown">
          <CaretUpFilled />
          <span>隐藏源代码</span>
        </div>
      </Transition>
    </div>
  </XProvider>
</template>

<style lang="scss">
// reset vitepress style
.example {
  .example-showcase {
    ul {
      list-style: none;
    }
  }
}
</style>

<style scoped lang="scss">
.example {
  border: 1px solid var(--vp-border-color);
  border-radius: 8px;

  .example-showcase {
    padding: 1.5rem;
    margin: 0.5px;
    overflow-x: auto;

    :deep(table) {
      margin: 0;

      tr {
        border: unset;
        background-color: unset;

        td {
          border: unset;
        }
      }
    }
  }

  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      transition: 0.2s;
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--vp-border-color);
    height: 44px;
    box-sizing: border-box;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;

    span {
      font-size: 14px;
      margin-left: 10px;
    }
  }
}

.fade-in-linear-enter-active,
.fade-in-linear-leave-active {
  transition: opacity 0.2s linear;
}

.fade-in-linear-enter-from,
.fade-in-linear-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import { Col, Row, Typography, theme, Tag, Flex } from 'ant-design-vue';
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue';
import { XProvider } from 'ant-design-x-vue'
import { useData } from 'vitepress'

const { semantics, height} = defineProps<{
  semantics: Array<{
    name: string;
    desc: string;
    version?: string;
  }>;
  height?: number;
}>()

const MARK_BORDER_SIZE = 2

const { token } = theme.useToken();

const { isDark } = useData()
const algorithm = computed(() => isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm)

// ======================= Semantic =======================
const getMarkClassName = (semanticKey: string) => `semantic-mark-${semanticKey}`

const semanticClassNames = computed(() => {
  const classNames: Record<string, string> = {};
  semantics.forEach((semantic) => {
    classNames[semantic.name] = getMarkClassName(semantic.name);
  });


  return classNames;
});


// ======================== Hover =========================
const containerRef = useTemplateRef('container');

let timer: ReturnType<typeof setTimeout> | null = null;

const positionMotion = ref(false)
const hoverSemantic = ref<string | null>(null)
const markPos = ref<[number, number, number, number]>([0,0,0,0])

watch(hoverSemantic, () => {
  if(timer) {
    clearTimeout(timer);
  }
  if (hoverSemantic.value) {
    const targetClassName = getMarkClassName(hoverSemantic.value);
    const targetElement = containerRef.value?.querySelector<HTMLElement>(`.${targetClassName}`);
    const containerRect = containerRef.value?.getBoundingClientRect();
    const targetRect = targetElement?.getBoundingClientRect();
    markPos.value = [
      (targetRect?.left || 0) - (containerRect?.left || 0),
      (targetRect?.top || 0) - (containerRect?.top || 0),
      targetRect?.width || 0,
      targetRect?.height || 0,
    ]
    timer = setTimeout(() => {
      positionMotion.value = true
    }, 10);
  } else {
    timer = setTimeout(() => {
      positionMotion.value = false
    }, 500);
  }
})

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
})

</script>

<template>
  <div class="semantic-container" ref="container">
    <Row :style="{minHeight: height}">
      <Col :span="18" class="col-wrap">
        <XProvider :theme="{
          algorithm
        }">
          <slot :classNames="semanticClassNames" />
        </XProvider>
      </Col>
      <Col :span="6">
          <ul class="list-wrap">
            <li
                v-for="semantic in semantics"
                :key="semantic.name"
                class="list-item"
                @mouseenter="hoverSemantic = semantic.name"
                @mouseleave="hoverSemantic = null"
              >
                <Flex vertical gap="small">
                  <Flex gap="small" align="center">
                    <Typography.Title :level="5" :style="{ margin: 0 }">
                      {{ semantic.name }}
                    </Typography.Title>
                    <Tag v-if="semantic.version" color="blue">{{ semantic.version }}</Tag>
                  </Flex>
                  <Typography.Paragraph :style="{margin: 0, fontSize: token.fontSizeSM + 'px' }">
                    {{ semantic.desc }}
                  </Typography.Paragraph>
                </Flex>
              </li>
          </ul>
        </Col>
    </Row>
    <div
      :class="`marker ${hoverSemantic ? 'marker-active' : 'marker-not-active'} ${positionMotion ? 'marker-motion' : 'marker-not-motion'}`"
    />
  </div>
</template>

<style scoped lang="scss">
.semantic-container {
  border: 1px solid var(--vp-border-color);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  .col-wrap {
    border-right: 1px solid v-bind('token.colorBorderSecondary');
    display: flex;
    justify-content: center;
    align-items: center;
    padding: v-bind('token.paddingMD + "px"');
    overflow: hidden;
  }
  .list-wrap {
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  .list-item {
    margin-top: 0;
    cursor: pointer;
    padding: v-bind('token.paddingSM + "px"');
    transition: background-color v-bind('token.motionDurationFast') ease;
    &:hover {
      background-color: v-bind('token.controlItemBgHover');
    }
    &:not(:first-of-type) {
      border-top: 1px solid v-bind('token.colorBorderSecondary');
    }
  }

  .marker {
    position: absolute;
    border: v-bind('MARK_BORDER_SIZE + "px"') solid v-bind('token.colorWarning');
    box-sizing: border-box;
    z-index: 999999;
    box-shadow: 0 0 0 1px #fff;
    pointer-events: none;
    inset-inline-start: v-bind('markPos[0] - MARK_BORDER_SIZE + "px"');
    top: v-bind('markPos[1] - MARK_BORDER_SIZE + "px"');
    width: v-bind('markPos[2] + MARK_BORDER_SIZE * 2 + "px"');
    height: v-bind('markPos[3] + MARK_BORDER_SIZE * 2 + "px"');
  };

  .marker-active {
    opacity: 1;
  }

  .marker-not-active {
    opacity: 0;
  }

  .marker-motion {
    transition:
      opacity v-bind('token.motionDurationSlow') ease,
      all v-bind('token.motionDurationSlow') ease;
  }
  .marker-not-motion {
    transition: opacity v-bind('token.motionDurationSlow') ease;
  }
}
</style>
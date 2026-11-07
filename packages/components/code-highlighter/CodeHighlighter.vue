<script setup lang="tsx">
import classnames from 'classnames';
import {
  computed,
  h,
  ref,
  useAttrs,
  watchEffect,
  type CSSProperties,
  type VNode,
} from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import pickAttrs from '../_util/pick-attrs';
import Actions from '../actions';
import { useXProviderContext } from '../x-provider';
import type { CodeHighlighterProps } from './interface';
import { ensurePrismLanguage, highlightCode } from './loadLanguage';
import useStyle from './style';

defineOptions({ name: 'AXCodeHighlighter', inheritAttrs: false });

const {
  lang,
  children,
  header,
  prefixCls: customizePrefixCls,
  rootClassName,
  className,
  class: classProp,
  style = {},
  styles = {},
  classNames = {},
  highlightProps,
  prismLightMode = true,
  ...restProps
} = defineProps<CodeHighlighterProps>();

const slots = defineSlots<{
  default?(): VNode[];
  header?(): VNode[];
}>();

const attrs = useAttrs();

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('codeHighlighter', customizePrefixCls);
const contextConfig = useXComponentConfig('codeHighlighter');
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const rootRef = ref<HTMLDivElement>();

defineExpose({
  nativeElement: rootRef,
});

function slotToText(nodes: VNode[] | undefined): string {
  if (!nodes?.length) return '';
  return nodes
    .map((n) => {
      if (typeof n.children === 'string') return n.children;
      if (Array.isArray(n.children)) {
        return (n.children as unknown[])
          .map((c) => (typeof c === 'string' ? c : ''))
          .join('');
      }
      return '';
    })
    .join('');
}

const codeText = computed(() => {
  if (typeof children === 'string') return children;
  return slotToText(slots.default?.());
});

const highlightedHtml = ref('');
const languageReady = ref(false);

watchEffect((onCleanup) => {
  let cancelled = false;
  onCleanup(() => {
    cancelled = true;
  });

  const text = codeText.value;
  const currentLang = lang;

  if (!text || !currentLang) {
    highlightedHtml.value = '';
    languageReady.value = true;
    return;
  }

  languageReady.value = false;
  const normalized = text.replace(/\n$/, '');

  void (async () => {
    const prismLang = await ensurePrismLanguage(
      currentLang,
      prismLightMode !== false,
    );
    if (cancelled) return;
    highlightedHtml.value = highlightCode(normalized, prismLang);
    languageReady.value = true;
  })();
});

const mergedCls = computed(() =>
  classnames(
    prefixCls,
    contextConfig.value.className,
    className,
    classProp,
    rootClassName,
    contextConfig.value.classNames?.root,
    classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const mergedStyle = computed<CSSProperties>(() => ({
  ...contextConfig.value.style,
  ...styles?.root,
  ...style,
}));

const domProps = computed(() =>
  pickAttrs(
    { ...attrs, ...restProps },
    { attr: true, aria: true, data: true },
  ),
);

function renderDefaultHeader() {
  return (
    <div
      class={classnames(
        `${prefixCls}-header`,
        contextConfig.value.classNames?.header,
        classNames.header,
      )}
      style={{ ...contextConfig.value.styles?.header, ...styles.header }}
    >
      <span
        class={classnames(
          `${prefixCls}-header-title`,
          classNames.headerTitle,
          contextConfig.value.classNames?.headerTitle,
        )}
        style={{
          ...contextConfig.value.styles?.headerTitle,
          ...styles.headerTitle,
        }}
      >
        {lang}
      </span>
      <Actions.Copy text={codeText.value} />
    </div>
  );
}

function renderHeader() {
  if (slots.header) {
    return slots.header();
  }

  if (header === undefined) {
    return renderDefaultHeader();
  }

  const headerResult = typeof header === 'function' ? header() : header;

  if (headerResult === false || headerResult === null) {
    return null;
  }

  return headerResult;
}

function withLineNumbers(html: string): string {
  if (!highlightProps?.showLineNumbers) return html;
  const start = highlightProps.startingLineNumber ?? 1;
  const lines = html.split('\n');
  return lines
    .map((line, i) => {
      const num = start + i;
      return `<span class="${prefixCls}-line-number">${num}</span>${line}`;
    })
    .join('\n');
}

defineRender(() => {
  const text = codeText.value;

  if (!text) {
    return null;
  }

  if (!lang) {
    return <code>{text}</code>;
  }

  const normalized = text.replace(/\n$/, '');
  const readyHtml =
    languageReady.value && highlightedHtml.value
      ? withLineNumbers(highlightedHtml.value)
      : null;

  const codeTagProps = (highlightProps?.codeTagProps || {}) as Record<
    string,
    unknown
  >;
  const codeStyle = {
    background: 'transparent',
    ...((codeTagProps.style as CSSProperties) || {}),
  };

  const codeNode = readyHtml
    ? h('code', {
        class: `language-${lang}`,
        style: codeStyle,
        ...codeTagProps,
        innerHTML: readyHtml,
      })
    : h(
        'code',
        {
          class: `language-${lang}`,
          style: { ...codeStyle, whiteSpace: 'pre-wrap' },
          ...codeTagProps,
        },
        normalized,
      );

  return wrapCSSVar(
    <div
      ref={rootRef}
      class={mergedCls.value}
      style={mergedStyle.value}
      {...domProps.value}
    >
      {renderHeader()}
      <div
        class={classnames(
          `${prefixCls}-code`,
          contextConfig.value.classNames?.code,
          classNames.code,
        )}
        style={{ ...contextConfig.value.styles?.code, ...styles.code }}
      >
        <pre class={`language-${lang}`}>{codeNode}</pre>
      </div>
    </div>,
  );
});
</script>

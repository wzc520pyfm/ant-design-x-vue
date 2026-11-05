<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownChineseLinkV2' });

import { onUnmounted, ref, watchEffect } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown, type Token } from '@ant-design-x-vue/x-markdown';
import { Button, Flex, Skeleton } from 'ant-design-vue';

const content =
  '[点此访问：Ant Design X](https://ant.design/index-cn)\n\nhttps://www.abc.com(abc)\n\n**AntDesign的官网是：https://ant.design/index-cn/在官网上，您可以了解更多AntDesign的信息**\n\nAntDesign的官网是：https://ant.design/index-cn/1?a=1&b=2。在官网上，您可以了解更多AntDesign的信息\n\nAntDesign的官网是：https://ant.design/index-cn/。在官网上，您可以了解更多AntDesign的信息\n\nAntDesign的官网是：https://ant.design/index-cn/1?a=1&b=2，在官网上，您可以了解更多AntDesign的信息';

const findFirstForbiddenCharIndex = (() => {
  const FORBIDDEN_CHARS = new Set(['(', ')', '[', ']', '{', '}', '（', '）', '「', '」', '。', '，']);
  const CHINESE_REGEX = /[\u4e00-\u9fa5]/;
  let segmenter: any = null;

  const getSegmenter = () => {
    if (segmenter !== null) return segmenter;
    if (typeof window !== 'undefined' && 'Intl' in window && 'Segmenter' in (Intl as any)) {
      try {
        segmenter = new (Intl as any).Segmenter('zh', { granularity: 'grapheme' });
      } catch {
        segmenter = null;
      }
    }
    return segmenter;
  };

  const isForbiddenChar = (char: string) => FORBIDDEN_CHARS.has(char) || CHINESE_REGEX.test(char);

  return (str: string): number => {
    if (!str) return -1;
    const seg = getSegmenter();
    if (seg) {
      let index = 0;
      for (const segment of seg.segment(str)) {
        const char = segment.segment;
        if (isForbiddenChar(char)) return index;
        index += char.length;
      }
    } else {
      for (let i = 0; i < str.length; i += 1) {
        if (isForbiddenChar(str[i])) return i;
      }
    }
    return -1;
  };
})();

const renderer = {
  link: (token: Token) => {
    const markdownLinkRegex = /\[[^\]]+\]\([^\s()<>]+(?:\([^\s()<>]*\))?\)/;
    if (!markdownLinkRegex.test(token.raw)) {
      const firstForbiddenCharIndex = findFirstForbiddenCharIndex(token.href || '');
      if (firstForbiddenCharIndex > 0) {
        const href = (token.href || '').slice(0, firstForbiddenCharIndex);
        const rest = (token.href || '').slice(firstForbiddenCharIndex);
        return `<a href=${href} target="_blank">${href}</a>${rest}`;
      }
    }
    return `<a href=${token.href} target="_blank">${token?.text || token.href}</a>`;
  },
};

const LinkSkeleton = () => (
  <Skeleton.Button active size="small" style={{ margin: '4px 0', width: 16, height: 16 }} />
);

const index = ref(0);
const isServer = import.meta.env.SSR;

watchEffect((onCleanup) => {
  if (isServer || index.value >= content.length) return;
  const timerId = setTimeout(() => {
    index.value = Math.min(content.length, index.value + 5);
  }, 20);
  onCleanup(() => clearTimeout(timerId));
});

onUnmounted(() => {
  index.value = content.length;
});

defineRender(() => (
  <Flex vertical gap="small">
    <Button style={{ alignSelf: 'flex-end' }} onClick={() => (index.value = 0)}>
      Re-Render
    </Button>
    <Flex gap="middle">
      <Bubble
        style={{ width: '50%' }}
        content={content.slice(0, index.value)}
        contentRender={(curr) => (
          <XMarkdown paragraphTag="div" content={`### Untreated\n\n${curr}`} />
        )}
        variant="outlined"
      />
      <Bubble
        style={{ width: '50%' }}
        content={content.slice(0, index.value)}
        contentRender={(curr) => (
          <XMarkdown
            streaming={{ hasNextChunk: index.value !== content.length }}
            components={{ 'incomplete-link': LinkSkeleton }}
            config={{ renderer }}
            paragraphTag="div"
            content={`### Treated\n\n${curr}`}
          />
        )}
        variant="outlined"
      />
    </Flex>
  </Flex>
));
</script>

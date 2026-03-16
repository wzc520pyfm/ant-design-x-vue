<script setup lang="tsx">
import { Button, Flex } from 'ant-design-vue';
import { onMounted, ref, type VNode } from 'vue';
import type { BubbleProps, EditableBubbleOption } from './interface';

defineOptions({ name: 'AXEditableContent' });

const props = defineProps<{
  content: string;
  prefixCls: BubbleProps['prefixCls'];
  okText?: EditableBubbleOption['okText'];
  cancelText?: EditableBubbleOption['cancelText'];
  onEditConfirm?: BubbleProps['onEditConfirm'];
  onEditCancel?: BubbleProps['onEditCancel'];
}>();

const mockInputRef = ref<HTMLDivElement | null>(null);

/**
 * 判断块级元素（跨浏览器）
 * div.contentEditable 在换行时会注入块级元素以达成换行效果
 * 编辑后提取格式化纯文本，需要识别出这些块级元素并替换为 \n
 */
function isBlock(el: HTMLElement): boolean {
  const d = getComputedStyle(el).display;
  return d === 'block' || d === 'flex' || d === 'list-item' || d === 'table';
}

function getPlainTextWithFormat(dom: HTMLElement) {
  const lines: string[] = [''];
  const walker = document.createTreeWalker(dom, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode as HTMLElement;

    if (node.nodeType === Node.TEXT_NODE) {
      // textContent 拒绝直接 xss
      lines[lines.length - 1] += node.textContent;
      continue;
    }

    // 单纯空行结构 <div><br></div>（chrome/edge/safari/firefox)，仅保留一个换行
    if (node.tagName === 'BR' && node.parentNode?.childElementCount === 1) {
      continue;
    }

    // 换行
    if (node.tagName === 'BR' || isBlock(node)) {
      lines.push('');
    }
  }

  return lines.join('\n');
}

const onConfirm = () => {
  // 但 onEditing 端应该对入参做 xss 防护
  props.onEditConfirm?.(getPlainTextWithFormat(mockInputRef.value!));
};

const onCancel = () => props.onEditCancel?.();

onMounted(() => {
  if (mockInputRef.value) {
    mockInputRef.value.textContent = props.content;
    mockInputRef.value.focus();
    const selection = window.getSelection()!;
    const range = document.createRange();
    range.selectNodeContents(mockInputRef.value);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

// 拒绝非 string content，保证 div 渲染纯文本（Text Node）而不是 HTML
if (typeof props.content !== 'string') {
  throw new Error('Content of editable Bubble should be string');
}

defineRender(() => {
  return (
    <>
      <div ref={mockInputRef} contenteditable />
      <Flex class={`${props.prefixCls}-editing-opts`} gap={8}>
        <Button type="primary" shape="round" size="small" onClick={onConfirm}>
          {props.okText || '确认'}
        </Button>
        <Button type="text" shape="round" size="small" onClick={onCancel}>
          {props.cancelText || '取消'}
        </Button>
      </Flex>
    </>
  );
});
</script>

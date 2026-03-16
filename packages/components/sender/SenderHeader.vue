<script setup lang="tsx">
import { CloseOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';
import classNames from 'classnames';
import type { SenderHeaderProps } from './interface';
import { useSenderHeaderContextInject } from './context';
import { computed, nextTick, Transition, useAttrs } from 'vue';

const slots = defineSlots<{
  default(props?: any): any
}>();

defineOptions({
  name: 'AXSenderHeader',
  inheritAttrs: false
});

const {
  title,
  onOpenChange,
  open,
  className,
  style,
  classNames: classes = {},
  styles = {},
  closable,
  forceRender,
} = defineProps<SenderHeaderProps>();

const SendHeaderContext = useSenderHeaderContextInject()

const headerCls = computed(() => `${SendHeaderContext.value.prefixCls}-header`)
const motionName = computed(() => `${headerCls.value}-motion`)
const attrs = useAttrs();

const onBeforeEnter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '0';
  htmlEl.style.borderBottomColor = 'transparent';
  htmlEl.style.overflow = 'hidden';
};

const onEnter = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  nextTick(() => {
    htmlEl.style.height = `${htmlEl.scrollHeight}px`;
  });
  htmlEl.addEventListener('transitionend', done, { once: true });
};

const onAfterEnter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '';
  htmlEl.style.overflow = '';
  htmlEl.style.borderBottomColor = '';
};

const onBeforeLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = `${htmlEl.scrollHeight}px`;
  htmlEl.style.overflow = 'hidden';
};

const onLeave = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  htmlEl.offsetHeight;
  htmlEl.style.height = '0';
  htmlEl.style.borderBottomColor = 'transparent';
  htmlEl.addEventListener('transitionend', done, { once: true });
};

const onAfterLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '';
  htmlEl.style.overflow = '';
  htmlEl.style.borderBottomColor = '';
};

defineRender(() => {
  return (
    <Transition
      name={motionName.value}
      onBeforeEnter={onBeforeEnter}
      onEnter={onEnter}
      onAfterEnter={onAfterEnter}
      onBeforeLeave={onBeforeLeave}
      onLeave={onLeave}
      onAfterLeave={onAfterLeave}
    >
      <div
        {...attrs}
        v-if={open || forceRender}
        v-show={open}
        class={classNames(headerCls.value, className)}
        style={{
          ...style,
        }}
      >
        {(closable !== false || title) && (
          <div
            class={
              classNames(`${headerCls.value}-header`, classes.header)
            }
            style={{
              ...styles.header,
            }}
          >
            <div class={`${headerCls.value}-title`}>{title}</div>
            {closable !== false && (
              <div class={`${headerCls.value}-close`}>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={() => {
                    onOpenChange?.(!open);
                  }}
                />
              </div>
            )}
          </div>
        )}
        {slots.default && (
          <div
            class={classNames(`${headerCls.value}-content`, classes.content)}
            style={{
              ...styles.content,
            }}
          >
            {slots.default?.()}
          </div>
        )}
      </div>
    </Transition>
  );
});
</script>

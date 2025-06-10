<script setup lang="tsx" generic="T = any">
import { CloseOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';
import classNames from 'classnames';
import type { SenderHeaderProps } from './interface';
import { useSenderHeaderContextInject } from './context';
import { computed, useAttrs } from 'vue';
import { TransitionCollapse } from '../transition-collapse'

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
const attrs = useAttrs();
defineRender(() => {
  return (
    <TransitionCollapse prefixCls={SendHeaderContext.value.prefixCls}>
      <div
        {...attrs}
        v-if={open || forceRender}
        v-show={open}
        class={classNames(headerCls.value, className)}
        style={{
          ...style,
        }}
      >
        {/* Header */}
        {(closable !== false || title) && (
          <div
            class={
              // We follow antd naming standard here.
              // So the header part is use `-header` suffix.
              // Though its little bit weird for double `-header`.
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

        {/* Content */}
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
    </TransitionCollapse>
  );
});
</script>

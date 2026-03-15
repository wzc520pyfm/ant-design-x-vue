<script setup lang="tsx">
import classnames from 'classnames';
import { computed, useId } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { useXProviderContext } from '../x-provider';
import type { ThoughtChainNodeProps } from './interface';
import { useThoughtChainContextInject } from './context';
import Status from './Status.vue';
import { TransitionCollapse } from '../transition-collapse';

defineOptions({ name: 'AXThoughtChainNode' });

const { info = {}, line, index, class: className, style, ...restProps } = defineProps<ThoughtChainNodeProps>();

const domProps = computed(() => pickAttrs(restProps, {
  attr: true,
  aria: true,
  data: true,
}));

const thoughtChainContext = useThoughtChainContextInject();
const prefixCls = computed(() => thoughtChainContext.value.prefixCls);
const expandedKeys = computed(() => thoughtChainContext.value.expandedKeys);
const onItemExpand = computed(() => thoughtChainContext.value.onItemExpand);
const classNames = computed(() => thoughtChainContext.value.classNames || {});
const styles = computed(() => thoughtChainContext.value.styles || {});

const { direction } = useXProviderContext();

const id = useId();

const key = computed(() => info.key ?? id);
const { collapsible, icon, blink, title, content, footer, status, description } = info;

const nodeCls = computed(() => `${prefixCls.value}-node`);

const contentOpen = computed(() => expandedKeys.value?.includes(key.value));

const iconNode = computed(() => {
  const defaultIcon = <div class={classnames(`${nodeCls.value}-index-icon`)}>{index + 1}</div>;
  if (icon === false) return null;
  return icon || defaultIcon;
});

defineRender(() => {
  return (
    <div
      {...domProps.value}
      class={classnames(nodeCls.value, className, classNames.value.item)}
      style={style}
    >
      {iconNode.value && (
        <Status
          class={classnames(`${nodeCls.value}-icon`, classNames.value.itemIcon, {
            [`${nodeCls.value}-icon-${line}`]: typeof line !== 'boolean',
          })}
          style={styles.value.itemIcon}
          prefixCls={prefixCls.value}
          icon={iconNode.value}
          status={status}
        />
      )}
      <div class={classnames(`${nodeCls.value}-box`)}>
        {/* Header */}
        <div
          class={classnames(`${nodeCls.value}-header`, classNames.value.itemHeader)}
          style={styles.value.itemHeader}
        >
          <div
            class={classnames(`${nodeCls.value}-title`, {
              [`${nodeCls.value}-collapsible`]: collapsible,
              [`${prefixCls.value}-motion-blink`]: blink,
            })}
            onClick={collapsible ? () => onItemExpand.value?.(key.value) : undefined}
          >
            {title}
            {collapsible &&
              content &&
              (direction.value === 'rtl' ? (
                <LeftOutlined
                  class={`${nodeCls.value}-collapse-icon`}
                  rotate={contentOpen.value ? -90 : 0}
                />
              ) : (
                <RightOutlined
                  class={`${nodeCls.value}-collapse-icon`}
                  rotate={contentOpen.value ? 90 : 0}
                />
              ))}
          </div>
          {description && <div class={`${nodeCls.value}-description`}>{description}</div>}
        </div>
        {/* Content */}
        {content && (
          <TransitionCollapse prefixCls={prefixCls.value}>
            <div
              v-show={collapsible ? contentOpen.value : true}
              class={classnames(`${nodeCls.value}-content`)}
            >
              <div
                class={classnames(`${nodeCls.value}-content-box`, classNames.value.itemContent)}
                style={styles.value.itemContent}
              >
                {content}
              </div>
            </div>
          </TransitionCollapse>
        )}
        {/* Footer */}
        {footer && (
          <div
            class={classnames(`${nodeCls.value}-footer`, classNames.value.itemFooter)}
            style={styles.value.itemFooter}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});
</script>

<script setup lang="tsx">
import classnames from 'classnames';
import { computed } from 'vue';
import { useCompatId } from '../_util/vueCompat';
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

const id = useCompatId();

const key = computed(() => info.key ?? id);
const collapsible = computed(() => info.collapsible);
const icon = computed(() => info.icon);
const blink = computed(() => info.blink);
const title = computed(() => info.title);
const content = computed(() => info.content);
const footer = computed(() => info.footer);
const status = computed(() => info.status);
const description = computed(() => info.description);
const destroyOnHidden = computed(() => info.destroyOnHidden !== false);

const nodeCls = computed(() => `${prefixCls.value}-node`);

const contentOpen = computed(() => expandedKeys.value?.includes(key.value));

const contentVisible = computed(() => (collapsible.value ? contentOpen.value : true));

const iconNode = computed(() => {
  const defaultIcon = <div class={classnames(`${nodeCls.value}-index-icon`)}>{index + 1}</div>;
  if (icon.value === false) return null;
  return icon.value || defaultIcon;
});

defineRender(() => {
  const contentInner = (
    <div
      class={classnames(`${nodeCls.value}-content-box`, classNames.value.itemContent)}
      style={styles.value.itemContent}
    >
      {content.value}
    </div>
  );

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
          status={status.value}
        />
      )}
      <div class={classnames(`${nodeCls.value}-box`)}>
        <div
          class={classnames(`${nodeCls.value}-header`, classNames.value.itemHeader)}
          style={styles.value.itemHeader}
        >
          <div
            class={classnames(`${nodeCls.value}-title`, {
              [`${nodeCls.value}-collapsible`]: collapsible.value,
              [`${prefixCls.value}-motion-blink`]: blink.value,
            })}
            onClick={collapsible.value ? () => onItemExpand.value?.(key.value) : undefined}
          >
            {title.value}
            {collapsible.value &&
              content.value &&
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
          {description.value && <div class={`${nodeCls.value}-description`}>{description.value}</div>}
        </div>
        {content.value && (
          <TransitionCollapse prefixCls={prefixCls.value}>
            {destroyOnHidden.value ? (
              contentVisible.value ? (
                <div class={classnames(`${nodeCls.value}-content`)}>{contentInner}</div>
              ) : null
            ) : (
              <div
                v-show={contentVisible.value}
                class={classnames(`${nodeCls.value}-content`)}
              >
                {contentInner}
              </div>
            )}
          </TransitionCollapse>
        )}
        {footer.value && (
          <div
            class={classnames(`${nodeCls.value}-footer`, classNames.value.itemFooter)}
            style={styles.value.itemFooter}
          >
            {footer.value}
          </div>
        )}
      </div>
    </div>
  );
});
</script>

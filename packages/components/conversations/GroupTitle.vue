<script setup lang="tsx">
import classnames from 'classnames';
import { useGroupTitleContextInject } from './context';
import { computed, Transition, nextTick } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';

defineOptions({ name: 'AXConversationsGroupTitle' });

export interface GroupTitleProps {
  className?: string;
}

const props = defineProps<GroupTitleProps>();

const slots = defineSlots<{
  default(props?: any): any;
}>();

const groupTitleContext = useGroupTitleContextInject();

const prefixCls = computed(() => groupTitleContext.value.prefixCls);
const groupInfo = computed(() => groupTitleContext.value.groupInfo);
const enableCollapse = computed(() => groupTitleContext.value.enableCollapse);
const expandedKeys = computed(() => groupTitleContext.value.expandedKeys);
const onItemExpand = computed(() => groupTitleContext.value.onItemExpand);

const label = computed(() => groupInfo.value?.label);
const name = computed(() => groupInfo.value?.name);
const collapsible = computed(() => groupInfo.value?.collapsible);

const labelNode = computed(() => {
  if (typeof label.value === 'function') {
    return label.value(name.value!, { groupInfo: groupInfo.value! });
  }
  return label.value || name.value;
});

const mergeCollapsible = computed(() => collapsible.value && enableCollapse.value);

const expandFun = () => {
  if (mergeCollapsible.value) {
    onItemExpand.value?.(groupInfo.value!.name);
  }
};

const groupOpen = computed(
  () => mergeCollapsible.value && !!expandedKeys.value?.includes?.(name.value!),
);

const onBeforeEnter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '0';
  htmlEl.style.opacity = '0';
  htmlEl.style.overflow = 'hidden';
};
const onEnter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  nextTick(() => {
    htmlEl.style.height = `${htmlEl.scrollHeight}px`;
    htmlEl.style.opacity = '1';
  });
};
const onAfterEnter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '';
  htmlEl.style.opacity = '';
  htmlEl.style.overflow = '';
};
const onBeforeLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = `${htmlEl.offsetHeight}px`;
  htmlEl.style.overflow = 'hidden';
};
const onLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  // force reflow
  void htmlEl.offsetHeight;
  htmlEl.style.height = '0';
  htmlEl.style.opacity = '0';
};
const onAfterLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '';
  htmlEl.style.opacity = '';
  htmlEl.style.overflow = '';
};

defineRender(() => {
  const childNode = slots.default?.();

  const contentVisible = mergeCollapsible.value ? groupOpen.value : true;

  return (
    <li class={props.className}>
      <div
        class={classnames(`${prefixCls.value}-group-title`, {
          [`${prefixCls.value}-group-title-collapsible`]: mergeCollapsible.value,
        })}
        onClick={expandFun}
      >
        {labelNode.value && (
          <div class={classnames(`${prefixCls.value}-group-label`)}>{labelNode.value}</div>
        )}
        {mergeCollapsible.value && (
          <div
            class={classnames(
              `${prefixCls.value}-group-collapse-trigger`,
              `${prefixCls.value}-group-collapse-trigger-${groupOpen.value ? 'open' : 'close'}`,
            )}
          >
            <RightOutlined />
          </div>
        )}
      </div>
      {mergeCollapsible.value ? (
        <Transition
          onBeforeEnter={onBeforeEnter}
          onEnter={onEnter}
          onAfterEnter={onAfterEnter}
          onBeforeLeave={onBeforeLeave}
          onLeave={onLeave}
          onAfterLeave={onAfterLeave}
          css={false}
        >
          {contentVisible && <div>{childNode}</div>}
        </Transition>
      ) : (
        <div>{childNode}</div>
      )}
    </li>
  );
});
</script>

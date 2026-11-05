<script setup lang="tsx">
import { CloseOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';
import classnames from 'classnames';
import { computed, type VNode } from 'vue';
import type { SkillType } from '../interface';

defineOptions({ name: 'AXSenderSkill' });

const props = defineProps<
  SkillType & {
    prefixCls: string;
    removeSkill: () => void;
  }
>();

const componentCls = computed(() => `${props.prefixCls}-skill`);

const closeNode = computed(() => {
  if (!props.closable) {
    return null;
  }

  const config = typeof props.closable === 'boolean' ? {} : props.closable;

  const handleClose = (event: MouseEvent) => {
    if (config.disabled) {
      return;
    }
    event.stopPropagation();
    props.removeSkill();
    config.onClose?.(event);
  };

  const closeIcon = config.closeIcon || (
    <CloseOutlined class={`${componentCls.value}-close-icon`} />
  );

  return (
    <div
      class={classnames(`${componentCls.value}-close`, {
        [`${componentCls.value}-close-disabled`]: config.disabled,
      })}
      onClick={handleClose}
      role="button"
      aria-label="Close skill"
      tabindex={0}
    >
      {closeIcon}
    </div>
  );
});

const mergeTitle = computed(() => props.title || props.value);

const titleNode = computed(() => {
  if (props.toolTip) {
    return <Tooltip {...(props.toolTip as any)}>{mergeTitle.value}</Tooltip>;
  }
  return mergeTitle.value as VNode | string;
});

defineRender(() => (
  <div class={`${componentCls.value}-wrapper`} contenteditable={false}>
    <div
      class={`${componentCls.value}-tag`}
      contenteditable={false}
      role="button"
      tabindex={0}
    >
      <span class={`${componentCls.value}-tag-text`}>{titleNode.value}</span>
      {closeNode.value}
    </div>
    <div class={`${componentCls.value}-holder`} />
  </div>
));
</script>

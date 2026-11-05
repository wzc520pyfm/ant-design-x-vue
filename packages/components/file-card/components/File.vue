<script setup lang="tsx">
import type { CSSProperties, VNode } from 'vue';
import { computed } from 'vue';
import classnames from 'classnames';
import type { SemanticType } from '../interface';
import { getSize } from '../utils';

defineOptions({ name: 'AXFileCardFile' });

const props = defineProps<{
  styles?: Partial<Record<SemanticType, CSSProperties>>;
  classNames?: Partial<Record<SemanticType, string>>;
  prefixCls?: string;
  name?: string;
  ext?: string;
  size?: 'small' | 'default';
  byte?: number;
  description?: VNode | string;
  icon?: VNode;
  iconColor?: string;
  onClick?: () => void;
  mask?: VNode | string;
}>();

const compCls = computed(() => `${props.prefixCls}-file`);

const mergedCls = computed(() =>
  classnames(compCls.value, props.classNames?.file, {
    [`${compCls.value}-pointer`]: !!props.onClick,
    [`${compCls.value}-small`]: props.size === 'small',
  }),
);

const desc = computed(() => {
  if (props.description) {
    return props.description;
  }
  if (typeof props.byte === 'number') {
    return getSize(props.byte);
  }
  return '';
});

defineRender(() => (
  <div class={mergedCls.value} style={props.styles?.file} onClick={props.onClick}>
    <div
      class={classnames(`${compCls.value}-icon`, props.classNames?.icon)}
      style={{ color: props.iconColor, ...props.styles?.icon }}
    >
      {props.icon}
    </div>
    <div class={`${compCls.value}-content`}>
      <div
        class={classnames(`${compCls.value}-name`, props.classNames?.name)}
        style={props.styles?.name}
      >
        <span class={`${compCls.value}-name-prefix`}>{props.name}</span>
        <span class={`${compCls.value}-name-suffix`}>{props.ext}</span>
      </div>
      {desc.value && (
        <div
          class={classnames(`${compCls.value}-description`, props.classNames?.description)}
          style={props.styles?.description}
        >
          {desc.value}
        </div>
      )}
    </div>
    {props.mask && (
      <div class={`${compCls.value}-mask`}>
        <div class={`${compCls.value}-mask-info`}>{props.mask}</div>
      </div>
    )}
  </div>
));
</script>

<script setup lang="tsx">
import type { CSSProperties } from 'vue';
import { toRef } from 'vue';
import { Flex, Spin } from 'ant-design-vue';
import classnames from 'classnames';
import type { VNode } from 'vue';
import ImageIcon from './ImageIcon.vue';
import usePercent from './usePercent';

defineOptions({ name: 'AXFileCardImageLoading' });

export interface ImageLoadingProps {
  prefixCls?: string;
  style?: CSSProperties;
  class?: string;
  spinProps?: {
    size?: 'small' | 'default' | 'large';
    showText?: boolean;
    icon?: VNode;
  } & Record<string, unknown>;
  percent?: number | 'auto';
}

const props = withDefaults(
  defineProps<ImageLoadingProps>(),
  {
    prefixCls: undefined,
    style: undefined,
    class: undefined,
    spinProps: undefined,
    percent: 'auto',
  },
);

const spinning = toRef(true);
const percentRef = toRef(() => props.percent);
const [mergedPercent, percentText] = usePercent(spinning, percentRef);

const getMergeSinkProps = () => ({
  size: 'default' as const,
  showText: true,
  icon: <ImageIcon color="rgba(0,0,0,.45)" size={props.spinProps?.size || 'default'} />,
  ...props.spinProps,
});

defineRender(() => {
  const mergeSinkProps = getMergeSinkProps();

  return (
    <div class={classnames(`${props.prefixCls}-image-loading`, props.class)} style={props.style}>
      <div class={classnames(`${props.prefixCls}-image-skeleton`)}>
        <Flex
          class={classnames(`${props.prefixCls}-image-spin`, {
            [`${props.prefixCls}-image-spin-${mergeSinkProps.size}`]: mergeSinkProps.size,
          })}
          align="center"
          gap="small"
        >
          <Spin {...({ percent: mergedPercent.value, ...(props.spinProps || {}) } as any)} />
          {mergeSinkProps.showText && (
            <div class={`${props.prefixCls}-image-spin-text`}>{percentText.value}</div>
          )}
        </Flex>
        {mergeSinkProps.icon}
      </div>
    </div>
  );
});
</script>

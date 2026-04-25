<script setup lang="tsx">
import { Typography } from 'ant-design-vue';
import classnames from 'classnames';
import { computed } from 'vue';
import type { CSSProperties, VNodeChild } from 'vue';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';

defineOptions({ name: 'AXActionsCopy' });

interface Props {
  text?: string;
  icon?: VNodeChild;
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
});

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);

const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const copyCls = `${prefixCls}-copy`;

const mergedCls = computed(() =>
  classnames(
    copyCls,
    hashId.value,
    cssVarCls,
    props.rootClassName,
    props.className,
    `${prefixCls}-item`,
    {
      [`${copyCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

defineRender(() => {
  return wrapCSSVar(
    <Typography.Text
      class={mergedCls.value}
      style={props.style}
      prefixCls={copyCls}
      copyable={{ text: props.text, icon: props.icon as any }}
    />,
  );
});
</script>

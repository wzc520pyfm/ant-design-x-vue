<script setup lang="tsx">
import classnames from 'classnames';
import { computed, ref, useAttrs } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { useActionsContextProvider } from './context';
import InternalItem from './Item.vue';
import type { ActionsProps, ActionsRef } from './interface';
import useStyle from './style';

defineOptions({ name: 'AXActions', inheritAttrs: false });

const props = withDefaults(defineProps<ActionsProps>(), {
  items: () => [],
  variant: 'borderless',
  rootClassName: '',
  className: '',
  classNames: () => ({}),
  styles: () => ({}),
  style: () => ({}),
  dropdownProps: () => ({}),
});

const emit = defineEmits<{
  click: [menuInfo: {
    item: any;
    key: string;
    keyPath: string[];
    domEvent: MouseEvent | KeyboardEvent;
  }];
}>();

const attrs = useAttrs();

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);
const rootPrefixCls = getPrefixCls();

const contextConfig = useXComponentConfig('actions');

const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const motionName = computed(() => {
  if (!props.fadeIn && !props.fadeInLeft) return '';
  return `${rootPrefixCls}-x-fade${props.fadeInLeft ? '-left' : ''}`;
});

const mergedCls = computed(() =>
  classnames(
    prefixCls,
    contextConfig.value.className,
    (contextConfig.value.classNames as any)?.root,
    props.rootClassName,
    props.className,
    props.classNames?.root,
    cssVarCls,
    hashId.value,
    {
      [`${prefixCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const mergedStyle = computed(() => ({
  ...contextConfig.value.style,
  ...props.styles?.root,
  ...props.style,
}));

const domProps = computed(() =>
  pickAttrs({ ...(attrs as object), ...(props as any) }, {
    attr: true,
    aria: true,
    data: true,
  }),
);

const containerRef = ref<HTMLDivElement | null>(null);

const innerCtx = computed(() => ({
  prefixCls,
  classNames: {
    item: classnames(
      (contextConfig.value.classNames as any)?.item,
      props.classNames?.item,
    ),
    itemDropdown: classnames(
      (contextConfig.value.classNames as any)?.itemDropdown,
      props.classNames?.itemDropdown,
    ),
  },
  styles: {
    item: {
      ...((contextConfig.value.styles as any)?.item || {}),
      ...(props.styles?.item || {}),
    },
    itemDropdown: {
      ...((contextConfig.value.styles as any)?.itemDropdown || {}),
      ...(props.styles?.itemDropdown || {}),
    },
  },
}));

useActionsContextProvider(innerCtx.value as any);

defineExpose<ActionsRef>({
  get nativeElement() {
    return containerRef.value;
  },
} as any);

const handleClick = (menuInfo: {
  item: any;
  key: string;
  keyPath: string[];
  domEvent: MouseEvent | KeyboardEvent;
}) => {
  props.onClick?.(menuInfo);
  emit('click', menuInfo);
};

defineRender(() => {
  return wrapCSSVar(
    <div
      ref={(el: any) => (containerRef.value = el)}
      {...domProps.value}
      class={mergedCls.value}
      style={mergedStyle.value as any}
    >
      <div
        class={classnames(
          `${prefixCls}-list`,
          `${prefixCls}-variant-${props.variant}`,
          motionName.value,
        )}
      >
        {(props.items || []).map((item, idx) => (
          <InternalItem
            key={item.key || idx}
            item={item}
            dropdownProps={props.dropdownProps}
            onMenuClick={handleClick}
          />
        ))}
      </div>
    </div>,
  );
});
</script>

<script setup lang="tsx">
import classnames from 'classnames';
import { computed } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import type { ThoughtChainProps } from './interface';
import { useXProviderContext } from '../x-provider';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useCollapsible from './hooks/useCollapsible';
import useStyle from './style';
import ThoughtChainContextProvider from './context';
import ThoughtChainNode from './ThoughtChainNode.vue';

defineOptions({ name: 'AXThoughtChain' });

const {
  prefixCls: customizePrefixCls,
  rootClassName,
  class: className,
  items,
  defaultExpandedKeys,
  expandedKeys: customExpandedKeys,
  onExpand,
  styles = {},
  style,
  classNames = {},
  line = true,
  ...restProps
} = defineProps<ThoughtChainProps>();

const domProps = computed(() => pickAttrs(restProps, {
  attr: true,
  aria: true,
  data: true,
}));

const { getPrefixCls, direction } = useXProviderContext();

const prefixCls = computed(() => getPrefixCls('thought-chain', customizePrefixCls));

const contextConfig = useXComponentConfig('thoughtChain');

const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const mergedCls = computed(() => classnames(
  className,
  prefixCls.value,
  contextConfig.value.className,
  contextConfig.value.classNames.root,
  rootClassName,
  hashId.value,
  cssVarCls,
  classNames.root,
  `${prefixCls.value}-box`,
  {
    [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
  },
));

const [expandedKeys, onItemExpand] = useCollapsible({
  defaultExpandedKeys,
  expandedKeys: customExpandedKeys,
  onExpand,
});

defineRender(() => {
  return wrapCSSVar(
    <div
      {...domProps.value}
      class={mergedCls.value}
      style={{
        ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
        ...styles.root,
        ...(typeof style === 'object' ? style : {}),
      }}
    >
      <ThoughtChainContextProvider
        value={{
          prefixCls: prefixCls.value,
          expandedKeys: expandedKeys.value,
          onItemExpand,
          classNames: {
            itemHeader: classnames(contextConfig.value.classNames.itemHeader, classNames.itemHeader),
            itemContent: classnames(contextConfig.value.classNames.itemContent, classNames.itemContent),
            itemFooter: classnames(contextConfig.value.classNames.itemFooter, classNames.itemFooter),
            itemIcon: classnames(contextConfig.value.classNames.itemIcon, classNames.itemIcon),
          },
          styles: {
            itemHeader: { ...contextConfig.value.styles.itemHeader, ...styles.itemHeader },
            itemContent: { ...contextConfig.value.styles.itemContent, ...styles.itemContent },
            itemFooter: { ...contextConfig.value.styles.itemFooter, ...styles.itemFooter },
            itemIcon: { ...contextConfig.value.styles.itemIcon, ...styles.itemIcon },
          },
        }}
      >
        {items?.map((item, index) => (
          <ThoughtChainNode
            key={item.key || `key_${index}`}
            index={index}
            line={line}
            class={classnames(contextConfig.value.classNames.item, classNames.item)}
            style={{ ...contextConfig.value.styles.item, ...styles.item }}
            info={item}
          />
        ))}
      </ThoughtChainContextProvider>
    </div>,
  );
});
</script>

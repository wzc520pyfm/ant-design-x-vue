<script setup lang="tsx">
import classnames from 'classnames';
import { computed } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import type { ThoughtChainProps } from './interface';
import { useXProviderContext } from '../x-provider';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useCollapsible from './hooks/useCollapsible';
import useStyle from './style';
import ThoughtChainNodeContextProvider from './context';
import ThoughtChainNode from './item.vue';

defineOptions({ name: 'AXThoughtChain' });

const {
  prefixCls: customizePrefixCls,
  rootClassName,
  class: className,
  items,
  collapsible,
  styles = {},
  style,
  classNames = {},
  size = 'middle',
  ...restProps
} = defineProps<ThoughtChainProps>();

const domProps = computed(() => pickAttrs(restProps, {
  attr: true,
  aria: true,
  data: true,
}));

// ============================ Prefix ============================
const { getPrefixCls, direction } = useXProviderContext();

const rootPrefixCls = computed(() => getPrefixCls());

const prefixCls = computed(() => getPrefixCls('thought-chain', customizePrefixCls));

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('thoughtChain');

// ============================ UseCollapsible ============================
const [
  enableCollapse,
  expandedKeys,
  onItemExpand,
  // collapseMotion
] = useCollapsible(
  () => collapsible,
  prefixCls.value,
  rootPrefixCls.value,
);

// ============================ Style ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const mergedCls = computed(() => classnames(
  className,
  rootClassName,
  prefixCls.value,
  contextConfig.value.className,
  hashId.value,
  cssVarCls,
  {
    [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
  },
  `${prefixCls.value}-${size}`,
));

defineRender(() => {
  return wrapCSSVar(
    <div
      {...domProps.value}
      class={mergedCls.value}
      style={{
        ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
        ...(typeof style === 'object' ? style : {})
      }}
    >
      <ThoughtChainNodeContextProvider
        value={{
          prefixCls: prefixCls.value,
          enableCollapse: enableCollapse.value,
          // collapseMotion,
          expandedKeys: expandedKeys.value,
          direction: direction.value,
          classNames: {
            itemHeader: classnames(contextConfig.value.classNames.itemHeader, classNames.itemHeader),
            itemContent: classnames(contextConfig.value.classNames.itemContent, classNames.itemContent),
            itemFooter: classnames(contextConfig.value.classNames.itemFooter, classNames.itemFooter),
          },
          styles: {
            itemHeader: { ...contextConfig.value.styles.itemHeader, ...styles.itemHeader },
            itemContent: { ...contextConfig.value.styles.itemContent, ...styles.itemContent },
            itemFooter: { ...contextConfig.value.styles.itemFooter, ...styles.itemFooter },
          },
        }}
      >
        {items?.map((item, index) => (
          <ThoughtChainNode
            key={item.key || `key_${index}`}
            class={classnames(contextConfig.value.classNames.item, classNames.item)}
            style={{ ...contextConfig.value.styles.item, ...styles.item }}
            info={{
              ...item,
              icon: item.icon || index + 1,
            }}
            onClick={onItemExpand}
            nextStatus={items[index + 1]?.status || item.status}
          />
        ))}
      </ThoughtChainNodeContextProvider>
    </div>
  )
});
</script>

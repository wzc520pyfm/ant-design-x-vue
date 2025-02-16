<script setup lang="tsx" generic="T = any">
import classnames from 'classnames';
import type { RenderChildrenProps, SuggestionItem, SuggestionProps } from './interface';
import { useXProviderContext } from '../x-provider';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useStyle from './style';
import { computed, type VNode } from 'vue';
import useState from '../_util/hooks/use-state';
import { Cascader, type CascaderProps } from 'ant-design-vue';
import useActive from './useActive';

defineOptions({ name: 'AXSuggestion' });

const {
  prefixCls: customizePrefixCls,
  className,
  rootClassName,
  style,
  children,
  open = false,
  onOpenChange,
  items,
  onSelect,
  block,
} = defineProps<SuggestionProps<T>>();

const slots = defineSlots<{
  default?(props?: RenderChildrenProps<T>): VNode;
}>();

// ============================= MISC =============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('suggestion', customizePrefixCls));
const itemCls = `${prefixCls.value}-item`;

const isRTL = computed(() => direction.value === 'rtl');

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('suggestion');

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

// =========================== Trigger ============================
const [mergedOpen, setOpen] = useState(open);

const [info, setInfo] = useState<T | undefined>();

const triggerOpen = (nextOpen: boolean) => {
  setOpen(nextOpen);
  onOpenChange?.(nextOpen);
};

const onTrigger: RenderChildrenProps<T>['onTrigger'] = (nextInfo) => {
  if (nextInfo === false) {
    triggerOpen(false);
  } else {
    setInfo(nextInfo);
    triggerOpen(true);
  }
};

const onClose = () => {
  triggerOpen(false);
};

// ============================ Items =============================
const itemList = computed(() => {
  return typeof items === 'function' ? items(info.value) : items
});

// =========================== Cascader ===========================
// TODO
// const optionRender: CascaderProps<SuggestionItem>['optionRender'] = (node) => {
//   return (
//     <Flex className={itemCls}>
//       {node.icon && <div className={`${itemCls}-icon`}>{node.icon}</div>}
//       {node.label}
//       {node.extra && <div className={`${itemCls}-extra`}>{node.extra}</div>}
//     </Flex>
//   );
// };

const onInternalChange = (valuePath: string[]) => {
  if (onSelect) {
    onSelect(valuePath[valuePath.length - 1]);
  }
  triggerOpen(false);
};

// ============================= a11y =============================
const [activePath, onKeyDown] = useActive(itemList, mergedOpen, isRTL, onInternalChange, onClose);

// =========================== Children ===========================
const childNode = computed(() => {
  if (slots.default) {
    return slots.default({ onTrigger, onKeyDown });
  }
  return children?.({ onTrigger, onKeyDown });
});

defineRender(() => {
  return wrapCSSVar(
    <Cascader
      options={itemList.value}
      open={mergedOpen.value}
      value={activePath.value}
      placement={isRTL.value ? 'topRight' : 'topLeft'}
      onDropdownVisibleChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      // optionRender={optionRender}
      class={classnames(rootClassName, prefixCls.value, hashId, cssVarCls, {
        [`${prefixCls.value}-block`]: block,
      })}
      onChange={onInternalChange as CascaderProps['onChange']}
      dropdownMatchSelectWidth={block}
    >
      {{
        default: () => <div
        class={classnames(
          prefixCls.value,
          contextConfig.value.className,
          rootClassName,
          className,
          `${prefixCls.value}-wrapper`,
          hashId.value,
          cssVarCls,
        )}
        style={{
          ...contextConfig.value.style,
          ...style,
        }}
      >
        {childNode.value}
      </div>
      }}
    </Cascader>
  )
});
</script>

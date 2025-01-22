<script setup lang="tsx">
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import type { Conversation, ConversationsItemProps, ConversationsProps } from './interface';
import ConversationsItem from './ConversationsItem.vue';
import GroupTitle from './GroupTitle.vue';
import { computed, ref, watch } from 'vue';
import useMergedState from '../_util/hooks/useMergedState';
import { useXProviderContext } from '../x-provider';
import useGroupable from './hooks/useGroupable';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useStyle from './style';
import GroupTitleContextProvider from './context';

defineOptions({ name: 'AXConversations' });

const {
  prefixCls: customizePrefixCls,
  rootClassName,
  items,
  activeKey: activeKeyProp,
  defaultActiveKey,
  onActiveChange,
  menu,
  styles = {},
  classNames = {},
  groupable,
  class: className,
  style,
  ...restProps
} = defineProps<ConversationsProps>();

const activeKey = ref(activeKeyProp);

const domProps = computed(() => pickAttrs(restProps, {
  attr: true,
  aria: true,
  data: true,
}));

// ============================ ActiveKey ============================
const [mergedActiveKey, setMergedActiveKey] = useMergedState<ConversationsProps['activeKey']>(
  defaultActiveKey,
  {
    value: activeKey,
  },
);

// hack for useMergedState error
watch(() => activeKeyProp, () => {
  activeKey.value = activeKeyProp
});

// ============================ Groupable ============================
const groupSate = useGroupable(() => groupable, () => items);

// ============================ Prefix ============================
const { getPrefixCls, direction } = useXProviderContext();

const prefixCls = computed(() => getPrefixCls('conversations', customizePrefixCls));

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('conversations');

// ============================ Style ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const mergedCls = computed(() => classnames(
  prefixCls.value,
  contextConfig.value.className,
  className,
  rootClassName,
  hashId.value,
  cssVarCls,
  {
    [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
  },
));

// ============================ Events ============================
const onConversationItemClick: ConversationsItemProps['onClick'] = (info) => {
  setMergedActiveKey(info.key);

  if (onActiveChange) {
    onActiveChange(info.key);
  }
};

defineRender(() => {
  return wrapCSSVar(
    <ul
      {...domProps.value}
      style={{
        ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
        ...(typeof style === 'object' ? style : {}),
      }}
      class={mergedCls.value}
    >
      {groupSate.value.groupList.map((groupInfo, groupIndex) => {
        const convItems = groupInfo.data.map((convInfo: Conversation, convIndex: number) => (
          <ConversationsItem
            key={convInfo.key || `key-${convIndex}`}
            info={convInfo}
            prefixCls={prefixCls.value}
            direction={direction.value}
            class={classnames(classNames.item, contextConfig.value.classNames.item)}
            style={{ ...contextConfig.value.styles.item, ...styles.item }}
            menu={typeof menu === 'function' ? menu(convInfo) : menu}
            active={mergedActiveKey.value === convInfo.key}
            onClick={onConversationItemClick}
          />
        ));

        // With group to show the title
        if (groupSate.value.enableGroup) {
          return (
            <li key={groupInfo.name || `key-${groupIndex}`}>
              <GroupTitleContextProvider value={{ prefixCls: prefixCls.value }}>
                {groupInfo.title?.(groupInfo.name!, { components: { GroupTitle } }) || (
                  <GroupTitle key={groupInfo.name}>{groupInfo.name}</GroupTitle>
                )}
              </GroupTitleContextProvider>
              <ul class={`${prefixCls.value}-list`}>{convItems}</ul>
            </li>
          );
        }

        return convItems;
      })}
    </ul>
  )
});
</script>

<script setup lang="tsx">
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import { Divider } from 'ant-design-vue';
import type {
  ConversationItemType,
  ConversationsItemProps,
  ConversationsProps,
  ItemType,
} from './interface';
import ConversationsItem from './ConversationsItem.vue';
import GroupTitle from './GroupTitle.vue';
import Creation from './Creation.vue';
import { computed, ref, watch } from 'vue';
import useMergedState from '../_util/hooks/useMergedState';
import { useXProviderContext } from '../x-provider';
import useGroupable from './hooks/useGroupable';
import useCollapsible from '../_util/hooks/use-collapsible';
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
  creation,
  ...restProps
} = defineProps<ConversationsProps>();

const activeKey = ref(activeKeyProp);

const domProps = computed(() => pickAttrs(restProps, {
  attr: true,
  aria: true,
  data: true,
}));

const containerRef = ref<HTMLElement>();

// ============================ ActiveKey ============================
const [mergedActiveKey, setMergedActiveKey] = useMergedState<ConversationsProps['activeKey']>(
  defaultActiveKey,
  {
    value: activeKey,
  },
);

watch(() => activeKeyProp, () => {
  activeKey.value = activeKeyProp;
});

// ============================ Groupable ============================
const groupState = useGroupable(() => groupable, () => items);

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
  contextConfig.value.classNames.root,
  className,
  classNames.root,
  rootClassName,
  hashId.value,
  cssVarCls,
  {
    [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
  },
));

// ============================ Events ============================
const onConversationItemClick: ConversationsItemProps['onClick'] = (key) => {
  setMergedActiveKey(key);

  if (onActiveChange) {
    onActiveChange(key!);
  }
};

// ============================ Item Node ============================
const getItemNode = (itemData: ItemType[]) =>
  itemData.map((conversationInfo: ItemType, conversationIndex: number) => {
    if (conversationInfo.type === 'divider') {
      return (
        <Divider
          key={`key-divider-${conversationIndex}`}
          class={`${prefixCls.value}-divider`}
          dashed={conversationInfo.dashed}
        />
      );
    }
    const baseConversationInfo = conversationInfo as ConversationItemType;
    const { label: _, disabled: __, icon: ___, ...restInfo } = baseConversationInfo;
    return (
      <ConversationsItem
        {...restInfo}
        key={baseConversationInfo.key || `key-${conversationIndex}`}
        info={baseConversationInfo}
        prefixCls={prefixCls.value}
        direction={direction.value}
        class={classnames(
          classNames.item,
          contextConfig.value.classNames.item,
          baseConversationInfo.className,
        )}
        style={{
          ...contextConfig.value.styles.item,
          ...styles.item,
          ...(typeof baseConversationInfo.style === 'object' ? baseConversationInfo.style : {}),
        }}
        menu={typeof menu === 'function' ? menu(baseConversationInfo) : menu}
        active={mergedActiveKey.value === baseConversationInfo.key}
        onClick={onConversationItemClick}
      />
    );
  });

// ============================ Item Collapsible ============================
const rootPrefixCls = computed(() => getPrefixCls());
const collapsibleOptions = computed(() => groupState.value[1]);
const [enableCollapse, expandedKeys, onItemExpand] = useCollapsible(
  collapsibleOptions,
  prefixCls.value,
  rootPrefixCls.value,
);

defineRender(() => {
  const [groupList] = groupState.value;

  return wrapCSSVar(
    <ul
      {...domProps.value}
      ref={containerRef}
      style={({
        ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
        ...(typeof style === 'object' ? style : {}),
        ...contextConfig.value.styles.root,
        ...styles.root,
      }) as any}
      class={mergedCls.value}
    >
      {!!creation && (
        <Creation
          class={classnames(contextConfig.value.classNames.creation, classNames.creation)}
          style={{
            ...contextConfig.value.styles.creation,
            ...styles.creation,
          }}
          prefixCls={`${prefixCls.value}-creation`}
          {...creation}
        />
      )}
      {groupList.map((groupInfo, groupIndex) => {
        const itemNode = getItemNode(groupInfo.data);

        return groupInfo.enableGroup ? (
          <GroupTitleContextProvider
            key={groupInfo.name || `key-${groupIndex}`}
            value={{
              prefixCls: prefixCls.value,
              groupInfo: {
                ...groupInfo,
                collapsible: !!groupInfo.collapsible,
              },
              enableCollapse: enableCollapse.value,
              expandedKeys: expandedKeys.value,
              onItemExpand,
            }}
          >
            <GroupTitle class={classnames(contextConfig.value.classNames.group, classNames.group)}>
              <ul
                class={classnames(`${prefixCls.value}-list`, {
                  [`${prefixCls.value}-group-collapsible-list`]: groupInfo.collapsible,
                })}
                style={{ ...contextConfig.value.styles.group, ...styles.group }}
              >
                {itemNode}
              </ul>
            </GroupTitle>
          </GroupTitleContextProvider>
        ) : (
          itemNode
        );
      })}
    </ul>
  );
});

defineExpose({ nativeElement: containerRef });
</script>

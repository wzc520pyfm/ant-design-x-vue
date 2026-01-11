<script setup lang="tsx">
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { Dropdown, type MenuProps } from 'ant-design-vue';
import { computed } from 'vue';
import { useXProviderContext } from '../x-provider';
import type { ActionsProps, ActionItem, ItemType } from './interface';

defineOptions({ name: 'AXActionMenu' });

const props = defineProps<{
  item: ItemType;
  prefixCls?: string;
}>();

const emit = defineEmits<{
  click: [menuInfo: {
    item: ActionItem;
    key: string;
    keyPath: string[];
    domEvent: MouseEvent | KeyboardEvent;
  }];
}>();

const findItem = (keyPath: string[], items: ActionItem[]): ActionItem | null => {
  const keyToFind = keyPath[0]; // Get the first key from the keyPath

  for (const item of items) {
    if (item.key === keyToFind) {
      // If the item is found and this is the last key in the path
      if (keyPath.length === 1) return item;

      // If it is a SubItemType, recurse to find in its children
      if ('children' in item && item.children) {
        return findItem(keyPath.slice(1), item.children);
      }
    }
  }

  return null;
};

const { getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);

const icon = computed(() => props.item?.icon ?? <EllipsisOutlined />);
const children = computed(() => props.item.children || []);
const triggerSubMenuAction = computed(() => props.item.triggerSubMenuAction || 'hover');

const menuProps = computed<MenuProps>(() => ({
  items: children.value as MenuProps['items'],
  onClick: ({ key, keyPath, domEvent }) => {
    const foundItem = findItem(keyPath as string[], children.value);
    if (foundItem?.onItemClick) {
      foundItem.onItemClick(foundItem);
      return;
    }
    emit('click', {
      key: key as string,
      keyPath: [...(keyPath as string[]), props.item.key],
      domEvent: domEvent as MouseEvent | KeyboardEvent,
      item: foundItem!,
    });
  },
}));

defineRender(() => {
  return (
    <Dropdown
      menu={menuProps.value}
      overlayClassName={`${prefixCls}-sub-item`}
      arrow
      trigger={[triggerSubMenuAction.value]}
    >
      <div class={`${prefixCls}-list-item`}>
        <div class={`${prefixCls}-list-item-icon`}>{icon.value}</div>
      </div>
    </Dropdown>
  );
});
</script>


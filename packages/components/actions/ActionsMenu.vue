<script setup lang="tsx">
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { Dropdown, Menu } from 'ant-design-vue';
import classnames from 'classnames';
import { computed, h } from 'vue';
import { useActionsContextInject } from './context';
import type { ItemType, ActionsProps } from './interface';

defineOptions({ name: 'AXActionsMenu' });

interface Props {
  item: ItemType;
  dropdownProps?: ActionsProps['dropdownProps'];
  onMenuClick?: (menuInfo: {
    item: ItemType;
    key: string;
    keyPath: string[];
    domEvent: MouseEvent | KeyboardEvent;
  }) => void;
}

const props = defineProps<Props>();

const ctx = useActionsContextInject();

const findItem = (keyPath: string[], items: ItemType[] = []): ItemType | null => {
  const keyToFind = keyPath[0];
  for (const item of items) {
    if (!item) return null;
    if (item.key === keyToFind) {
      if (keyPath.length === 1) return item;
      if (item.subItems) {
        return findItem(keyPath.slice(1), item.subItems as ItemType[]);
      }
    }
  }
  return null;
};

const subItems = computed(() => (props.item.subItems ?? []) as ItemType[]);
const triggerSubMenuAction = computed(() => props.item.triggerSubMenuAction ?? 'hover');

const handleMenuClick = (payload: {
  key: string;
  keyPath: string[];
  domEvent: MouseEvent | KeyboardEvent;
}) => {
  const { key, keyPath, domEvent } = payload;
  const target = findItem(keyPath, subItems.value);
  if (target?.onItemClick) {
    target.onItemClick(target);
    return;
  }
  props.onMenuClick?.({
    key,
    keyPath: [...keyPath, props.item.key || ''],
    domEvent,
    item: target!,
  });
};

defineRender(() => {
  const icon = props.item.icon ?? h(EllipsisOutlined);
  const rootClassName = classnames(
    `${ctx.prefixCls}-dropdown`,
    ctx.classNames?.itemDropdown,
  );

  const menuSlot = () => (
    <Menu
      items={subItems.value.map((it) => ({
        key: it.key,
        label: it.label,
        icon: it.icon,
        danger: it.danger,
      }))}
      onClick={handleMenuClick as any}
    />
  );

  return (
    <Dropdown
      trigger={[triggerSubMenuAction.value as any]}
      overlayClassName={rootClassName}
      overlayStyle={ctx.styles?.itemDropdown}
      arrow
      {...(props.dropdownProps || {})}
      v-slots={{ overlay: menuSlot }}
    >
      <div
        class={classnames(
          `${ctx.prefixCls}-item`,
          `${ctx.prefixCls}-sub-item`,
          ctx.classNames?.item,
        )}
        style={ctx.styles?.item}
      >
        <div class={`${ctx.prefixCls}-icon`}>{icon as any}</div>
      </div>
    </Dropdown>
  );
});
</script>

<script setup lang="tsx">
import { Tooltip } from 'ant-design-vue';
import classnames from 'classnames';
import ActionsMenu from './ActionsMenu.vue';
import { useActionsContextInject } from './context';
import type { ActionsProps, ItemType } from './interface';

defineOptions({ name: 'AXActionsInternalItem' });

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

const renderActionRender = (item: ItemType) => {
  const ar = item.actionRender;
  if (typeof ar === 'function') {
    return (ar as (item: ItemType) => any)(item);
  }
  return ar;
};

defineRender(() => {
  const { item } = props;
  if (!item) return null;

  if (item.actionRender !== undefined && item.actionRender !== null) {
    return renderActionRender(item);
  }

  if (item.subItems && item.subItems.length > 0) {
    return (
      <ActionsMenu
        item={item}
        dropdownProps={props.dropdownProps}
        onMenuClick={props.onMenuClick}
      />
    );
  }

  const itemKey = item.key ?? '';

  return (
    <div
      class={classnames(`${ctx.prefixCls}-item`, ctx.classNames?.item, {
        [`${ctx.prefixCls}-list-danger`]: item.danger,
      })}
      style={ctx.styles?.item}
      onClick={(domEvent: MouseEvent) => {
        if (item.onItemClick) {
          item.onItemClick(item);
          return;
        }
        props.onMenuClick?.({
          key: itemKey,
          item,
          keyPath: [itemKey],
          domEvent,
        });
      }}
    >
      <Tooltip title={item.label}>
        <div class={`${ctx.prefixCls}-icon`}>{item.icon as any}</div>
      </Tooltip>
    </div>
  );
});
</script>

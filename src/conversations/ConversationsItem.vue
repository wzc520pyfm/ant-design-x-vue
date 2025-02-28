<script setup lang="tsx">
import classnames from 'classnames';
import type { EventHandler, MouseEventHandler } from 'ant-design-vue/es/_util/EventInterface';
import type { ConversationsItemProps } from './interface';
import pickAttrs from '../_util/pick-attrs';
import { computed } from 'vue';
import { Dropdown, Menu, Tooltip, Typography } from 'ant-design-vue';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import useState from '../_util/hooks/use-state';

defineOptions({ name: 'AXConversationsItem' });

const {
  prefixCls,
  info,
  class: className,
  direction,
  onClick,
  active,
  menu,
  ...restProps
} = defineProps<ConversationsItemProps>();

const domProps = computed(() => pickAttrs(restProps, {
  aria: true,
  data: true,
  attr: true,
}));

const stopPropagation: EventHandler = (e) => {
  e.stopPropagation();
};

// ============================= MISC =============================
const disabled = computed(() => info.disabled);

// =========================== Ellipsis ===========================
const [inEllipsis, onEllipsis] = useState(false);

// =========================== Tooltip ============================
const [opened, setOpened] = useState(false);

// ============================ Style =============================
const mergedCls = computed(() => classnames(
  className,
  `${prefixCls}-item`,
  { [`${prefixCls}-item-active`]: active && !disabled.value },
  { [`${prefixCls}-item-disabled`]: disabled.value },
));

// ============================ Events ============================
const onInternalClick: MouseEventHandler = () => {
  if (!disabled.value && onClick) {
    onClick(info);
  }
};

const onOpenChange = (open: boolean) => {
  if (open) {
    setOpened(!open);
  }
};

defineRender(() => {
  return (
    <Tooltip
      title={info.label}
      open={inEllipsis.value && opened.value}
      onOpenChange={setOpened}
      placement={direction === 'rtl' ? 'left' : 'right'}
    >
      <li {...domProps.value} class={mergedCls.value} onClick={onInternalClick}>
        {info.icon && <div class={`${prefixCls}-icon`}>{info.icon}</div>}
        <Typography.Text
          // @ts-expect-error
          class={`${prefixCls}-label`}
          ellipsis={{
            onEllipsis,
          }}
        >{info.label}</Typography.Text>
        {menu && !disabled.value && (
          <Dropdown
            placement={direction === 'rtl' ? 'bottomLeft' : 'bottomRight'}
            trigger={['click']}
            disabled={disabled.value}
            onOpenChange={onOpenChange}
          >{{
            default: () => <EllipsisOutlined
              onClick={stopPropagation}
              // @ts-expect-error
              disabled={disabled.value}
              class={`${prefixCls}-menu-icon`}
            />,
            overlay: () => <Menu { ...menu} />
          }}
          </Dropdown>
        )}
      </li>
    </Tooltip>
  )
});
</script>

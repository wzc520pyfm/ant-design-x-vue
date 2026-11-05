<script setup lang="tsx">
import classnames from 'classnames';
import type { EventHandler, MouseEventHandler } from 'ant-design-vue/es/_util/EventInterface';
import type { ConversationItemType } from './interface';
import pickAttrs from '../_util/pick-attrs';
import { computed } from 'vue';
import { Dropdown, Menu, Typography } from 'ant-design-vue';
import { EllipsisOutlined } from '@ant-design/icons-vue';

defineOptions({ name: 'AXConversationsItem' });

interface ResolvedConversationsItemProps {
  info: ConversationItemType;
  prefixCls?: string;
  direction?: 'ltr' | 'rtl';
  menu?: Record<string, any> & {
    trigger?: any;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  };
  active?: boolean;
  onClick?: (value: string) => void;
  class?: any;
}

const {
  prefixCls,
  info,
  class: className,
  direction,
  onClick,
  active,
  menu,
  ...restProps
} = defineProps<ResolvedConversationsItemProps>();

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
    onClick(info.key);
  }
};

// ============================ Menu ============================
const trigger = computed(() => menu?.trigger);
const dropdownMenu = computed(() => {
  const { trigger, ...rest } = menu || {};
  return rest;
});

const getPopupContainer = computed(() => dropdownMenu.value?.getPopupContainer);

const renderMenuTrigger = (conversation: ConversationItemType) => {
  const originTriggerNode = (
    <EllipsisOutlined onClick={stopPropagation} class={`${prefixCls}-menu-icon`} />
  );
  if (trigger.value) {
    return typeof trigger.value === 'function'
      ? trigger.value(conversation, { originNode: originTriggerNode })
      : trigger.value;
  }
  return originTriggerNode;
};

defineRender(() => {
  return (
    <li
      title={typeof info.label === 'object' ? undefined : `${info.label}`}
      {...domProps.value}
      class={mergedCls.value}
      onClick={onInternalClick}
    >
      {info.icon && <div class={`${prefixCls}-icon`}>{info.icon}</div>}
      <Typography.Text
        // @ts-expect-error
        class={`${prefixCls}-label`}
      >{info.label}</Typography.Text>
      {!disabled.value && menu && (
        <div onClick={stopPropagation}>
          <Dropdown
            placement={direction === 'rtl' ? 'bottomLeft' : 'bottomRight'}
            trigger={['click']}
            disabled={disabled.value}
            getPopupContainer={getPopupContainer.value}
          >{{
            default: () => renderMenuTrigger(info),
            overlay: () => <Menu {...dropdownMenu.value} />
          }}
          </Dropdown>
        </div>
      )}
    </li>
  );
});
</script>

<script setup lang="tsx">
import classnames from 'classnames';
import { useXProviderContext } from '../x-provider';
import type { WelcomeProps } from './interface';
import useXComponentConfig from '../_util/hooks/use-x-component-config';

import useStyle from './style';
import { computed, type VNode } from 'vue';
import { Flex, Typography } from 'ant-design-vue';

defineOptions({ name: 'AXWelcome' });

const {
  prefixCls: customizePrefixCls,
  rootClassName,
  className,
  style,
  variant = 'filled',

  // Semantic
  classNames = {},
  styles = {},

  // Layout
  icon,
  title,
  description,
  extra,
} = defineProps<WelcomeProps>();

const slots = defineSlots<{
  title?(): VNode | string;
  description?(): VNode | string;
  icon?(): VNode | string;
  extra?(): VNode | string;
}>();

// ============================= MISC =============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('welcome', customizePrefixCls);

// ======================= Component Config =======================
const contextConfig = useXComponentConfig('welcome');

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

// ============================= Icon =============================
const iconNode = computed(() => {
  const _icon = slots.icon ? slots.icon() : icon;
  if (!_icon) {
    return null;
  }

  let iconEle = _icon;
  if (typeof _icon === 'string' && _icon.startsWith('http')) {
    iconEle = <img src={_icon} alt="icon" />;
  }
  return (
    <div
      class={classnames(`${prefixCls}-icon`, contextConfig.value.classNames.icon, classNames.icon)}
      style={styles.icon}
    >
      {iconEle}
    </div>
  );
});

const titleNode = computed(() => {
  const _title = slots.title ? slots.title() : title;
  if (!_title) {
    return null;
  }

  return (
    <Typography.Title
      level={4}
      // @ts-expect-error
      class={classnames(
        `${prefixCls}-title`,
        contextConfig.value.classNames.title,
        classNames.title,
      )}
      style={styles.title}
    >
      {_title}
    </Typography.Title>
  );
});

const descriptionNode = computed(() => {
  if (slots.description) {
    return slots.description();
  }
  return description;
})

const extraNode = computed(() => {
  const _extra = slots.extra ? slots.extra() : extra;
  if (!_extra) {
    return null;
  }

  return (
    <div
      class={classnames(
        `${prefixCls}-extra`,
        contextConfig.value.classNames.extra,
        classNames.extra,
      )}
      style={styles.extra}
    >
      {_extra}
    </div>
  );
});

defineRender(() => {
  return wrapCSSVar(
    <Flex
      // ref={ref}
      class={classnames(
        prefixCls,
        contextConfig.value.className,
        className,
        rootClassName,
        hashId.value,
        cssVarCls,
        `${prefixCls}-${variant}`,
        {
          [`${prefixCls}-rtl`]: direction.value === 'rtl',
        },
      )}
      style={style}
    >
      {/* Icon */}
      {iconNode.value}

      {/* Content */}
      <Flex vertical class={`${prefixCls}-content-wrapper`}>
        {/* Title */}
        {(slots.extra || extra) ? (
          <Flex align="flex-start" class={`${prefixCls}-title-wrapper`}>
            {titleNode.value}
            {extraNode.value}
          </Flex>
        ) : (
          titleNode.value
        )}

        {/* Description */}
        {descriptionNode.value && (
          <Typography.Text
            // @ts-expect-error
            class={classnames(
              `${prefixCls}-description`,
              contextConfig.value.classNames.description,
              classNames.description,
            )}
            style={styles.description}
          >
            {descriptionNode.value}
          </Typography.Text>
        )}
      </Flex>
    </Flex>
  )
})
</script>

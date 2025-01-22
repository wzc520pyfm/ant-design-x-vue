<script setup lang="tsx">
import classnames from 'classnames';
import { useXProviderContext } from '../x-provider';
import type { WelcomeProps } from './interface';
import useXComponentConfig from '../_util/hooks/use-x-component-config';

import useStyle from './style';
import { computed } from 'vue';
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

// ============================= MISC =============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('welcome', customizePrefixCls);

// ======================= Component Config =======================
const contextConfig = useXComponentConfig('welcome');

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

// ============================= Icon =============================
const iconNode = computed(() => {
  if (!icon) {
    return null;
  }

  let iconEle = icon;
  if (typeof icon === 'string' && icon.startsWith('http')) {
    iconEle = <img src={icon} alt="icon" />;
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
  if (!title) {
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
      {title}
    </Typography.Title>
  );
});

const extraNode = computed(() => {
  if (!extra) {
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
      {extra}
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
        {extra ? (
          <Flex align="flex-start" class={`${prefixCls}-title-wrapper`}>
            {titleNode.value}
            {extraNode.value}
          </Flex>
        ) : (
          titleNode.value
        )}

        {/* Description */}
        {description && (
          <Typography.Text
            // @ts-expect-error
            class={classnames(
              `${prefixCls}-description`,
              contextConfig.value.classNames.description,
              classNames.description,
            )}
            style={styles.description}
          >
            {description}
          </Typography.Text>
        )}
      </Flex>
    </Flex>
  )
})
</script>

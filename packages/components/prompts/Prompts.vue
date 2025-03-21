<script setup lang="tsx">
import classnames from 'classnames';
import useStyle from './style';
import type { PromptsProps } from './interface';
import { useXProviderContext } from '../x-provider';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { computed, type VNode } from 'vue';
import { Typography } from 'ant-design-vue';
import Prompts from '.';

defineOptions({ name: 'AXPrompts' });

const {
  prefixCls: customizePrefixCls,
  title,
  class: className,
  items,
  onItemClick,
  vertical,
  wrap,
  rootClassName,
  styles = {},
  classNames = {},
  style,
  ...htmlProps
} = defineProps<PromptsProps>();

const slots = defineSlots<{
  title?(): VNode | string;
}>();

// ============================ PrefixCls ============================
const { getPrefixCls, direction } = useXProviderContext();

const prefixCls = getPrefixCls('prompts', customizePrefixCls);

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('prompts');

// ============================ Style ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const mergedCls = computed(() => classnames(
  prefixCls,
  contextConfig.value.className,
  className,
  rootClassName,
  hashId.value,
  cssVarCls,
  {
    [`${prefixCls}-rtl`]: direction.value === 'rtl',
  },
));

const mergedListCls = computed(() => classnames(
  `${prefixCls}-list`,
  contextConfig.value.classNames.list,
  classNames.list,
  { [`${prefixCls}-list-wrap`]: wrap },
  { [`${prefixCls}-list-vertical`]: vertical },
));

// ============================ Nodes ============================
const titleNode = computed(() => {
  if (slots.title) {
    return slots.title();
  }
  return title;
});

defineRender(() => {
  return wrapCSSVar(
    <div
      {...htmlProps}
      class={mergedCls.value}
      // @ts-expect-error
      style={{
        ...(typeof style === 'object' ? style : {}),
        ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
      }}
    >
      {/* Title */}
      {titleNode.value && (
        <Typography.Title
          level={5}
          // @ts-expect-error
          class={classnames(
            `${prefixCls}-title`,
            contextConfig.value.classNames.title,
            classNames.title,
          )}
          style={{ ...contextConfig.value.styles.title, ...styles.title }}
        >
          {titleNode.value}
        </Typography.Title>
      )}
      {/* Prompt List */}
      <div class={mergedListCls.value} style={{ ...contextConfig.value.styles.list, ...styles.list }}>
        {items?.map((info, index) => {
          const isNest = info.children && info.children.length > 0;

          return (
            <div
              key={info.key || `key_${index}`}
              style={{ ...contextConfig.value.styles.item, ...styles.item }}
              class={classnames(
                `${prefixCls}-item`,
                contextConfig.value.classNames.item,
                classNames.item,
                {
                  [`${prefixCls}-item-disabled`]: info.disabled,
                  [`${prefixCls}-item-has-nest`]: isNest,
                },
              )}
              onClick={() => {
                if (!isNest && onItemClick) {
                  onItemClick({ data: info });
                }
              }}
            >
              {/* Icon */}
              {info.icon && <div class={`${prefixCls}-icon`}>{info.icon}</div>}
              {/* Content */}
              <div
                class={classnames(
                  `${prefixCls}-content`,
                  contextConfig.value.classNames.itemContent,
                  classNames.itemContent,
                )}
                style={{ ...contextConfig.value.styles.itemContent, ...styles.itemContent }}
              >
                {/* Label */}
                {info.label && <h6 class={`${prefixCls}-label`}>{info.label}</h6>}

                {/* Description */}
                {info.description && <p class={`${prefixCls}-desc`}>{info.description}</p>}

                {/* Children */}
                {isNest && (
                  <Prompts
                    class={`${prefixCls}-nested`}
                    items={info.children}
                    vertical
                    onItemClick={onItemClick}
                    classNames={{
                      list: classNames.subList,
                      item: classNames.subItem,
                    }}
                    styles={{
                      list: styles.subList,
                      item: styles.subItem,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
});
</script>

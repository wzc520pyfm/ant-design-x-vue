<script setup lang="tsx">
import { CloseCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';
import classnames from 'classnames';
import { computed, nextTick, ref, useTemplateRef, watch, TransitionGroup } from 'vue';
import { useXProviderContext } from '../x-provider';
import FileCard from './FileCard.vue';
import useStyle from './style';
import type { FileCardListProps, FileCardProps } from './interface';

defineOptions({ name: 'AXFileCardList' });

const props = withDefaults(defineProps<FileCardListProps>(), {
  classNames: () => ({}),
  styles: () => ({}),
  items: () => [],
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

const list = ref<(FileCardProps & { key: string | number })[]>([]);

watch(
  () => props.items,
  (items) => {
    list.value = items.map((item, index) => ({
      ...item,
      key: `${item.name}-${index}`,
    }));
  },
  { immediate: true },
);

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('file-card', props.prefixCls));
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
const compCls = computed(() => `${prefixCls.value}-list`);

const pingStart = ref(false);
const pingEnd = ref(false);

const classNameRoot = computed(() => props.classNames.root);
const classNameCard = computed(() => props.classNames.card);
const classNameOther = computed(() => {
  const { root: _, card: __, ...other } = props.classNames;
  return other;
});

const mergedCls = computed(() =>
  classnames(
    compCls.value,
    props.rootClassName,
    props.class,
    classNameRoot.value,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${compCls.value}-overflow-${props.overflow}`]: props.overflow,
      [`${compCls.value}-overflow-ping-start`]: pingStart.value,
      [`${compCls.value}-overflow-ping-end`]: pingEnd.value,
      [`${compCls.value}-small`]: props.size === 'small',
    },
  ),
);

const checkPing = () => {
  const containerEle = containerRef.value;
  if (!containerEle) return;

  if (props.overflow === 'scrollX') {
    pingStart.value = Math.abs(containerEle.scrollLeft) >= 1;
    pingEnd.value =
      containerEle.scrollWidth - containerEle.clientWidth - Math.abs(containerEle.scrollLeft) >= 1;
  } else if (props.overflow === 'scrollY') {
    pingStart.value = containerEle.scrollTop !== 0;
    pingEnd.value =
      containerEle.scrollHeight - containerEle.clientHeight !== containerEle.scrollTop;
  }
};

watch([() => props.overflow, () => props.items.length], () => {
  nextTick(() => checkPing());
}, { immediate: true });

const onScrollOffset = (offset: -1 | 1) => {
  const containerEle = containerRef.value;
  if (containerEle) {
    containerEle.scrollTo({
      left: containerEle.scrollLeft + offset * containerEle.clientWidth,
      behavior: 'smooth',
    });
  }
};

const handleRemove = (item: FileCardProps, key: string | number) => {
  list.value = list.value.filter((i) => i.key !== key);
  props.onRemove?.(item);
};

const otherStyles = computed(() => {
  const { root: _, card: __, ...other } = props.styles;
  return other;
});

const onLeave = (el: Element, done: () => void) => {
  const animation = el.animate(
    [
      { opacity: 1 },
      { opacity: 0 },
    ],
    { duration: 300, easing: 'ease', fill: 'forwards' },
  );
  animation.onfinish = () => done();
};

defineRender(() => {
  return wrapCSSVar(
    <div class={`${compCls.value}-wrapper`}>
      <div
        class={mergedCls.value}
        dir={direction.value}
        style={{ ...props.style, ...props.styles.root }}
        ref="containerRef"
        onScroll={checkPing}
      >
        <TransitionGroup css={false} onLeave={onLeave}>
          {list.value.map(({ key, ...item }) => (
            <div class={classnames(`${compCls.value}-item`)} key={key}>
              <FileCard
                {...item}
                size={props.size}
                class={classnames(item.class, classNameCard.value)}
                classNames={{ ...classNameOther.value, ...item.classNames }}
                style={{ ...item.style, ...props.styles.card }}
                styles={otherStyles.value}
              />
              {(typeof props.removable === 'function' ? props.removable(item) : props.removable) && (
                <div class={`${compCls.value}-remove`} onClick={() => handleRemove(item, key)}>
                  <CloseCircleFilled />
                </div>
              )}
            </div>
          ))}
        </TransitionGroup>

        {props.overflow === 'scrollX' && (
          <>
            <Button
              size="small"
              shape="circle"
              class={`${compCls.value}-prev-btn`}
              onClick={() => onScrollOffset(-1)}
            >
              {{ icon: () => <LeftOutlined /> }}
            </Button>
            <Button
              size="small"
              shape="circle"
              class={`${compCls.value}-next-btn`}
              onClick={() => onScrollOffset(1)}
            >
              {{ icon: () => <RightOutlined /> }}
            </Button>
          </>
        )}
        {props.extension}
      </div>
    </div>,
  );
});
</script>

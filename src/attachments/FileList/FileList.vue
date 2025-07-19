<script setup lang="tsx">
import classnames from 'classnames';
import { computed, nextTick, onWatcherCleanup, ref, useTemplateRef, watch, watchEffect, TransitionGroup } from 'vue';
import { Button } from 'ant-design-vue';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons-vue';
import type { FileListProps } from '../interface';
import useState from '../../_util/hooks/use-state';
import { useAttachmentContextInject } from '../context';
import SilentUploader from '../SilentUploader.vue';
import FileListCard from './FileListCard.vue';

defineOptions({ name: 'AXAttachmentsFileList' });

const TOLERANCE = 1;

const {
  prefixCls,
  items,
  onRemove,
  overflow,
  upload,
  listClassName,
  listStyle,
  itemClassName,
  itemStyle,
  imageProps,
} = defineProps<FileListProps>();

const listCls = computed(() => `${prefixCls}-list`);

const containerRef = useTemplateRef<HTMLDivElement>('file-list-container');
// const containerRef = ref<HTMLDivElement>(null);

const [firstMount, setFirstMount] = useState(false);

// has disabled
const attachmentContext = useAttachmentContextInject();

watchEffect(() => {
  setFirstMount(true);

  onWatcherCleanup(() => {
    setFirstMount(false);
  })
});

// ================================= Scroll =================================
const [pingStart, setPingStart] = useState(false);
const [pingEnd, setPingEnd] = useState(false);

const checkPing = () => {
  const containerEle = containerRef.value;

  if (!containerEle) {
    return;
  }

  if (overflow === 'scrollX') {
    setPingStart(Math.abs(containerEle.scrollLeft) >= TOLERANCE);
    setPingEnd(
      containerEle.scrollWidth - containerEle.clientWidth - Math.abs(containerEle.scrollLeft) >=
      TOLERANCE,
    );
  } else if (overflow === 'scrollY') {
    setPingStart(containerEle.scrollTop !== 0);
    setPingEnd(containerEle.scrollHeight - containerEle.clientHeight !== containerEle.scrollTop);
  }
};

watch([() => overflow, () => items.length], () => {
  nextTick(() => {
    checkPing();
  });
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

const onScrollLeft = () => {
  onScrollOffset(-1);
};

const onScrollRight = () => {
  onScrollOffset(1);
};

defineRender(() => {
  return (
    <div
      class={classnames(
        listCls.value,
        {
          [`${listCls.value}-overflow-${overflow}`]: overflow,
          [`${listCls.value}-overflow-ping-start`]: pingStart.value,
          [`${listCls.value}-overflow-ping-end`]: pingEnd.value,
        },
        listClassName,
      )}
      ref="file-list-container"
      onScroll={checkPing}
      style={listStyle}
    >
      <TransitionGroup name="file-list-card">
         {items.map((item) => {
         return <FileListCard
          key={item.uid}
          prefixCls={prefixCls}
          item={item}
          onRemove={onRemove}
          className={classnames(itemClassName)}
          imageProps={imageProps}
          style={{
            ...itemStyle,
          }}
        />
      })}
      </TransitionGroup>
      {!attachmentContext.value.disabled && (
        <SilentUploader
          upload={upload}
          // TODO: need support slot also
          children={
            <Button class={`${listCls.value}-upload-btn`} type="dashed">
              <PlusOutlined class={`${listCls.value}-upload-btn-icon`} />
            </Button>
          }
        />
      )}

      {overflow === 'scrollX' && (
        <>
          <Button
            size="small"
            shape="circle"
            class={`${listCls.value}-prev-btn`}
            icon={<LeftOutlined />}
            onClick={onScrollLeft}
          />
          <Button
            size="small"
            shape="circle"
            class={`${listCls.value}-next-btn`}
            icon={<RightOutlined />}
            onClick={onScrollRight}
          />
        </>
      )}
    </div>
  )
})
</script>

<style lang="scss" scoped>
.file-list-card-enter-active {
  animation: card-enter 0.3s ease-in;

}

.file-list-card-leave-active {
  animation: card-leave 0.3s ease-out;
}

@keyframes card-enter {
  0% {
    opacity: 0;
    transform:  scale(0.7);
    filter: blur(2px);
  }
  25% {
    opacity: 0.5;
    transform:scale(0.8);
    filter: blur(1px);
  }
  50% {
    opacity: 0.75;
    transform:scale(0.9);
    filter: blur(0.5px);
  }
  75% {
    opacity: 0.9;
    transform:scale(0.95);
    filter: blur(0px);
  }
  100% {
    opacity: 1;
    transform:scale(1);
  }
}

@keyframes card-leave {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.2);
    filter: blur(2px);
  }
}
</style>
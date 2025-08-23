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

const onEnter = (el: Element, done: () => void) => {
  const isImg = el.classList.contains('ant-attachment-list-card-type-preview')
  const keyframes = isImg 
    ? [
        { width: '0px' },
        { width: '64px' }
      ]
    : [
        { width: '0px' },
        { width: '236px' }
      ];
  const animation = el.animate(keyframes, {
    duration: 300, 
    easing: 'ease',
    fill: 'forwards'
  });
   animation.onfinish = () => done();
};

const onLeave = (el: Element, done: () => void) => {
  const isImg = el.classList.contains('ant-attachment-list-card-type-preview')
  const keyframes = isImg 
    ? [
        { opacity: 1, width: '64px', marginRight: '0px' },
        { opacity: 0, width: '0px', marginRight: '-10px' }
      ]
    : [
        { opacity: 1, width: '236px', marginRight: '0px' },
        { opacity: 0, width: '0px', marginRight: '-10px',paddingRight: '0px',paddingLeft: '0px' }
      ];
  const animation = el.animate(keyframes, {
    duration: 300,
    easing: 'ease',
    fill: 'forwards'
  });
  animation.onfinish = () => done();
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
      <TransitionGroup onEnter={onEnter} onLeave={onLeave} css={false}>
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
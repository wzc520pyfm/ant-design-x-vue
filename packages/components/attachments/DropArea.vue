<script setup lang="tsx">
import classnames from 'classnames';
import { computed, onMounted, onWatcherCleanup, Teleport, toValue, watch } from 'vue';
import useState from '../_util/hooks/use-state';
import { useAttachmentContextInject } from './context';
import type { DropUploaderProps } from './interface';

defineOptions({ name: 'AXAttachmentsDropArea' });

const { getDropContainer, className, prefixCls, children } = defineProps<DropUploaderProps>();

const attachmentContext = useAttachmentContextInject();

const [container, setContainer] = useState<HTMLElement | null | undefined>();
const [showArea, setShowArea] = useState<boolean | null>(null);

// ========================== Container ===========================
// Attachments children changed, unable watch getDropContainer, should setContainer on mounted
onMounted(() => {
  setContainer(getDropContainer?.());
})

watch(() => toValue(getDropContainer), () => {
  const nextContainer = getDropContainer?.();
  if (container.value !== nextContainer) {
    setContainer(nextContainer);
  }
});

// ============================= Drop =============================
watch(() => !!container.value, () => {
  // Add global drop event
  if (container.value) {
    const onDragEnter = () => {
      setShowArea(true);
    };

    // Should prevent default to make drop event work
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const onDragLeave = (e: DragEvent) => {
      if (!e.relatedTarget) {
        setShowArea(false);
      }
    };
    const onDrop = (e: DragEvent) => {
      setShowArea(false);
      e.preventDefault();
    };

    document.addEventListener('dragenter', onDragEnter);
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('dragleave', onDragLeave);
    document.addEventListener('drop', onDrop);
    onWatcherCleanup(() => {
      document.removeEventListener('dragenter', onDragEnter);
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('dragleave', onDragLeave);
      document.removeEventListener('drop', onDrop);
    });
  }
});

// =========================== Visible ============================
const showDropdown = computed(() => getDropContainer && container.value && !attachmentContext.value.disabled);

const areaCls = `${prefixCls}-drop-area`;

defineRender(() => {
  if (!showDropdown.value) {
    return null;
  }

  return (
    <Teleport to={container.value}>
      <div
        class={classnames(areaCls, className, {
          [`${areaCls}-on-body`]: container.value.tagName === 'BODY',
        })}
        style={{ display: showArea.value ? 'block' : 'none' }}
      >
        {children}
      </div>
    </Teleport>
  )
});
</script>

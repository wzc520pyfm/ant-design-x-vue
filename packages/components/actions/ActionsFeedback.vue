<script setup lang="tsx">
import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
} from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';
import classnames from 'classnames';
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import enUS from '../locale/en_US';
import useLocale from '../locale/useLocale';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';

defineOptions({ name: 'AXActionsFeedback' });

export type FeedbackValue = 'like' | 'dislike' | 'default';
export type FeedbackSemanticType = 'root' | 'like' | 'liked' | 'dislike' | 'disliked';

interface Props {
  value?: FeedbackValue;
  onChange?: (value: FeedbackValue) => void;
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<FeedbackSemanticType, string>>;
  styles?: Partial<Record<FeedbackSemanticType, CSSProperties>>;
}

const props = withDefaults(defineProps<Props>(), {
  value: 'default',
  classNames: () => ({}),
  styles: () => ({}),
});

const emit = defineEmits<{
  change: [value: FeedbackValue];
}>();

const [contextLocale] = useLocale('Actions', enUS.Actions);

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
const feedbackCls = `${prefixCls}-feedback`;

const mergedCls = computed(() =>
  classnames(
    feedbackCls,
    hashId.value,
    cssVarCls,
    props.rootClassName,
    props.classNames?.root,
    `${prefixCls}-list`,
    props.className,
    {
      [`${feedbackCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const handleChange = (next: FeedbackValue) => {
  props.onChange?.(next);
  emit('change', next);
};

const onLikeClick = () => handleChange(props.value === 'like' ? 'default' : 'like');
const onDislikeClick = () => handleChange(props.value === 'dislike' ? 'default' : 'dislike');

defineRender(() => {
  const showLike = props.value === 'default' || props.value === 'like';
  const showDislike = props.value === 'default' || props.value === 'dislike';
  return wrapCSSVar(
    <div
      class={mergedCls.value}
      style={{ ...props.style, ...props.styles?.root }}
    >
      {showLike && (
        <Tooltip title={contextLocale.value.feedbackLike}>
          <span
            onClick={onLikeClick}
            style={{
              ...props.styles?.like,
              ...(props.value === 'like' ? props.styles?.liked : {}),
            }}
            class={classnames(
              `${feedbackCls}-item`,
              `${prefixCls}-item`,
              `${feedbackCls}-item-like`,
              props.classNames?.like,
              {
                [`${props.classNames?.liked}`]:
                  !!props.classNames?.liked && props.value === 'like',
                [`${feedbackCls}-item-like-active`]: props.value === 'like',
              },
            )}
          >
            {props.value === 'like' ? <LikeFilled /> : <LikeOutlined />}
          </span>
        </Tooltip>
      )}
      {showDislike && (
        <Tooltip title={contextLocale.value.feedbackDislike}>
          <span
            onClick={onDislikeClick}
            style={{
              ...props.styles?.dislike,
              ...(props.value === 'dislike' ? props.styles?.disliked : {}),
            }}
            class={classnames(
              `${feedbackCls}-item`,
              `${prefixCls}-item`,
              `${feedbackCls}-item-dislike`,
              props.classNames?.dislike,
              {
                [`${props.classNames?.disliked}`]:
                  !!props.classNames?.disliked && props.value === 'dislike',
                [`${feedbackCls}-item-dislike-active`]: props.value === 'dislike',
              },
            )}
          >
            {props.value === 'dislike' ? <DislikeFilled /> : <DislikeOutlined />}
          </span>
        </Tooltip>
      )}
    </div>,
  );
});
</script>

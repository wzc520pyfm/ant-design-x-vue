<script setup lang="tsx">
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { Carousel } from 'ant-design-vue';
import classnames from 'classnames';
import { ref, watch, type CSSProperties } from 'vue';
import type { SourcesItem } from '../interface';

defineOptions({ name: 'AXSourcesCarouselCard' });

const props = defineProps<{
  activeKey?: string | number;
  prefixCls: string;
  items?: SourcesItem[];
  className?: string;
  style?: CSSProperties;
  onClick?: (item: SourcesItem) => void;
}>();

const compCls = `${props.prefixCls}-carousel`;

const slide = ref<number>(
  Math.max(0, props.items?.findIndex(({ key }) => key === props.activeKey) ?? 0),
);

const carouselRef = ref<InstanceType<typeof Carousel>>();

const handleClick = (item: SourcesItem) => {
  if (item.url) {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  }
  props.onClick?.(item);
};

watch(slide, (val) => {
  carouselRef.value?.goTo(val, false);
});

defineRender(() => (
  <div style={props.style} class={classnames(`${compCls}-wrapper`, props.className)}>
    <div class={`${compCls}-title`}>
      <div class={`${compCls}-btn-wrapper`}>
        <span
          class={classnames(`${compCls}-btn`, `${compCls}-left-btn`, {
            [`${compCls}-btn-disabled`]: slide.value === 0,
          })}
          onClick={() => {
            if (slide.value > 0) {
              slide.value -= 1;
            }
          }}
        >
          <LeftOutlined />
        </span>
        <span
          class={classnames(`${compCls}-btn`, `${compCls}-right-btn`, {
            [`${compCls}-btn-disabled`]: slide.value === (props.items?.length || 1) - 1,
          })}
          onClick={() => {
            if (slide.value < (props.items?.length || 1) - 1) {
              slide.value += 1;
            }
          }}
        >
          <RightOutlined />
        </span>
      </div>
      <div class={`${compCls}-page`}>{`${slide.value + 1}/${props.items?.length || 1}`}</div>
    </div>
    <Carousel
      class={compCls}
      ref={carouselRef}
      arrows={false}
      infinite={false}
      dots={false}
      beforeChange={(_: number, nextSlide: number) => {
        slide.value = nextSlide;
      }}
    >
      {props.items?.map((item, index) => (
        <div
          key={item.key ?? index}
          class={`${compCls}-item`}
          onClick={() => handleClick(item)}
        >
          <div class={`${compCls}-item-title-wrapper`}>
            {item.icon && <span class={`${compCls}-item-icon`}>{item.icon}</span>}
            <span class={`${compCls}-item-title`}>{item.title}</span>
          </div>
          {item.description && (
            <div class={`${compCls}-item-description`}>{item.description}</div>
          )}
        </div>
      ))}
    </Carousel>
  </div>
));
</script>

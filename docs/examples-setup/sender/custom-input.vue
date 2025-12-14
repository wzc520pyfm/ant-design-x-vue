<script lang="ts" setup>
import { defineComponent, h, ref, shallowRef } from 'vue';
import { Sender } from 'ant-design-x-vue';
import { Textarea } from 'ant-design-vue';
import { triggerFocus } from 'ant-design-vue/es/vc-input/utils/commonUtils';
import type { InputFocusOptions } from 'ant-design-x-vue/sender/interface';
import { textAreaProps } from 'ant-design-vue/es/input/inputProps';

defineOptions({ name: 'AXSenderCustomInputSetup' });

const value = ref<string>('');

const CustomTextarea = defineComponent({
  name: 'MyInputTextArea',
  props: textAreaProps(),
  setup(props, { attrs, expose }) {
    const textAreaRef = shallowRef();

    const focus = (option?: InputFocusOptions) => {
      triggerFocus(textAreaRef.value, option);
    };
    const blur = () => {
      textAreaRef.value?.blur();
    };

    expose({
      focus,
      blur,
    });

    return () =>
      h(Textarea, {
        ...attrs,
        ...props,
        value: props.value,
        disabled: props.disabled,
        ref: textAreaRef,
        bordered: false,
        showCount: true,
        maxlength: 20,
        autoSize: { minRows: 3, maxRows: 6 },
        placeholder: 'Type your message here...',
      });
  },
});

const onChange = (v: string) => {
  value.value = v;
};
const onSubmit = (message: string) => {
  console.log('Submitted:', message);
  value.value = '';
};
</script>
<template>
  <Sender
    :value="value"
    :components="{ input: CustomTextarea }"
    placeholder="Press Enter to send message"
    @change="onChange"
    @submit="onSubmit"
  />
</template>

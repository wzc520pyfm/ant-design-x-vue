<script lang="tsx" setup>
import { Input } from 'ant-design-vue';
import { textAreaProps } from 'ant-design-vue/es/input/inputProps';
import { triggerFocus } from 'ant-design-vue/es/vc-input/utils/commonUtils';
import { Sender } from 'ant-design-x-vue';
import type { InputFocusOptions } from 'ant-design-x-vue/sender/interface';
import { defineComponent, ref, shallowRef } from 'vue';

defineOptions({ name: 'AXSenderCustomInput' });

const value = ref<string>('');

const MyInputTextArea = defineComponent({
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

    return () => (
      <Input.TextArea
        {...attrs}
        {...props}
        ref={textAreaRef}
        style={{ minHeight: 100 }}
        autoSize={{ minRows: 3, maxRows: 6 }}
        showCount
        maxlength={20}
        placeholder="Type your message here..."
      />
    );
  },
});

defineRender(() => {
  return (
    <Sender
      value={value.value}
      onChange={(v) => {
        value.value = v;
      }}
      placeholder="Press Enter to send message"
      components={{
        input: MyInputTextArea,
      }}
      onSubmit={(message) => {
        console.log('Submitted:', message);
        value.value = '';
      }}
    />
  );
})
</script>

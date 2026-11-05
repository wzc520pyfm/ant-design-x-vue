<script setup lang="tsx">
defineOptions({ name: 'AXSenderSuffixV2' });

import { Sender } from 'ant-design-x-vue';
import { Space, Spin, Typography, message } from 'ant-design-vue';
import { RobotOutlined } from '@ant-design/icons-vue';
import { ref, watch } from 'vue';

const loading = ref(false);
const value = ref('');

watch(loading, (val) => {
  if (val) {
    const timer = setTimeout(() => {
      loading.value = false;
      value.value = '';
      message.success('Send message successfully!');
    }, 2000);
    return () => clearTimeout(timer);
  }
});

defineRender(() => (
  <Sender
    submitType="shiftEnter"
    value={value.value}
    loading={loading.value}
    onChange={(v) => { value.value = v; }}
    onSubmit={() => { loading.value = true; }}
    onCancel={() => { loading.value = false; }}
    suffix={(_, info) => {
      const { SendButton, LoadingButton, ClearButton, SpeechButton } = info.components;
      return (
        <Space size="small">
          <Typography.Text style={{ whiteSpace: 'nowrap' }} type="secondary">
            <small>`Shift + Enter` to submit</small>
          </Typography.Text>
          <ClearButton />
          <SpeechButton />
          {loading.value ? (
            <LoadingButton
              type="default"
              icon={<Spin size="small" />}
              disabled
            />
          ) : (
            <SendButton type="primary" icon={<RobotOutlined />} disabled={false} />
          )}
        </Space>
      );
    }}
  />
));
</script>

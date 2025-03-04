<script setup lang="tsx">
import { useStorage } from '@vueuse/core';
import { Switch, Descriptions, DescriptionsItem, theme } from 'ant-design-vue';
import { onMounted, ref } from 'vue';

defineOptions({ name: 'VpPreferenceSwitch' });

const { token } = theme.useToken();

const checked = ref(false);

const preferLocal = useStorage('antdx-docs-preference', 'tsx')

const triggerPreference = (prefer: 'tsx' | 'setup') => {
  if (typeof localStorage === 'undefined') {
    return () => {}
  }
  const classList = document.documentElement.classList
  classList.remove('prefer-tsx', 'prefer-setup')
  classList.add(`prefer-${prefer}`)
  preferLocal.value = prefer
};

onMounted(() => {
  if (preferLocal.value === 'tsx') {
    checked.value = true
  }
});
</script>

<template>
  <div style="margin-top: 16px;">
    <Descriptions>
      <DescriptionsItem label="风格偏好">
        <Switch
          v-model:checked="checked"
          @change="(e) => triggerPreference(e ? 'tsx' : 'setup')"
          :style="{
            background: token.colorBgSpotlight,
          }"
          unCheckedChildren="setup"
          checkedChildren="tsx"
        />
      </DescriptionsItem>
    </Descriptions>
  </div>
</template>

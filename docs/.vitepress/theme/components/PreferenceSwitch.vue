<script setup lang="tsx">
import { Switch, Descriptions, DescriptionsItem, theme } from 'ant-design-vue';
import { onMounted, ref } from 'vue';

defineOptions({ name: 'VpPreferenceSwitch' });

const { token } = theme.useToken();

const checked = ref(false);

const triggerPreference = (prefer: 'tsx' | 'setup') => {
  if (typeof localStorage === 'undefined') {
    return () => {}
  }
  const classList = document.documentElement.classList
  classList.remove('prefer-tsx', 'prefer-setup')
  classList.add(`prefer-${prefer}`)
  localStorage.setItem('antdx-docs-preference', prefer)
};

onMounted(() => {
  const prefer = localStorage.getItem('antdx-docs-preference') as 'tsx' | 'setup'
  if (prefer) {
    checked.value = prefer === 'tsx'
    triggerPreference(prefer)
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

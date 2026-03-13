<script setup lang="ts">
import type { XNotificationOpenArgs } from 'ant-design-x-vue';
import { notification } from 'ant-design-x-vue';

const DescribeInfo: Record<NotificationPermission, string> = {
  denied:
    'Notification permission has been denied, You need to manually reset the notification permissions in the website settings to trigger the permission request pop-up.',
  granted:
    'Notification permission has been granted, you can click the "Open a notification" button to push a notification.',
  default: 'Please Request Permission, After the request is approved, you can push notifications.',
};

const openData: XNotificationOpenArgs = {
  title: 'Task completed',
  body: 'The task was completed at 13:12',
  icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
  onClick: (event, close) => {
    console.log('onClick', event, close);
    close?.();
  },
  onClose: (event) => {
    console.log('onClose', event);
  },
  onError: (event) => {
    console.log('onError', event);
  },
  onShow: (event) => {
    console.log('onShow', event);
  },
};

const [{ permission }, { open, requestPermission, close }] = notification.useNotification();
</script>

<template>
  <a-flex vertical gap="middle">
    {{ DescribeInfo[permission] }}
    <a-flex gap="middle">
      <a-button
        :disabled="permission !== 'default'"
        type="primary"
        @click="requestPermission()"
      >
        {{
          permission === 'default'
            ? 'Please Request Permission'
            : `Notification permission has been ${permission}`
        }}
      </a-button>
      <a-button
        :disabled="permission !== 'granted'"
        type="primary"
        @click="open(openData)"
      >
        Open a notification
      </a-button>
      <a-button danger :disabled="permission !== 'granted'" @click="close()">
        Destroy All
      </a-button>
    </a-flex>
  </a-flex>
</template>

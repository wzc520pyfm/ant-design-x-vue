<script setup lang="tsx">
defineOptions({ name: 'AXNotificationCloseTagV2' });

import { notification } from 'ant-design-x-vue';
import { Button, Flex } from 'ant-design-vue';

const describeInfo: Record<NotificationPermission, string> = {
  denied:
    'Notification permission has been denied, You need to manually reset the notification permissions in the website settings to trigger the permission request pop-up.',
  granted:
    'Notification permission has been granted, you can click the "Open a notification" button to push a notification.',
  default: 'Please Request Permission, After the request is approved, you can push notifications.',
};

const [{ permission }, { open, close, requestPermission }] = notification.useNotification();

const openClick = () => {
  open({
    title: 'Task completed',
    body: 'The task was completed at 13:12',
    tag: 'tag_task_completed',
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
  });
};

defineRender(() => (
  <Flex vertical gap="middle">
    {describeInfo[permission.value]}
    <Flex gap="middle">
      <Button disabled={permission.value !== 'default'} type="primary" onClick={() => requestPermission()}>
        {permission.value === 'default'
          ? 'Please Request Permission'
          : `Notification permission has been ${permission.value}`}
      </Button>
      <Button disabled={permission.value !== 'granted'} type="primary" onClick={openClick}>
        Open a notification
      </Button>
      <Button
        danger
        disabled={permission.value !== 'granted'}
        onClick={() => close(['tag_task_completed'])}
      >
        Destroy tag
      </Button>
    </Flex>
  </Flex>
));
</script>

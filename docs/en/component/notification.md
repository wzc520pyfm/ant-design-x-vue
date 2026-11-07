
# Notification

System-level sending displays notifications outside the page.

## When to use

- When agents perform complex tasks, system-level application notifications can be pushed, allowing the user to stay informed of task progress at any time.
- Subject to operating system notification permission control, only used for weak notifications.

## Notes

- **`Notification` refers to system application notifications, which are subject to operating system notification permission control. If system notification permissions are turned off, calling the `open` method of XNotification will have no effect. [System Permission Settings](#system-permission-settings).**
- XNotification is implemented by extending `window.Notification`. If the browser environment does not support Notification, calling XNotification methods will have no effect.
- The notification style and effects of XNotification depend on the current browser environment's support for Notification. For example, the `dir` attribute will be ignored by most browsers.
- XNotification only manages the closing of notifications within the current instance. After the instance changes (e.g., browser page refresh), it cannot manage or close already sent notifications.

## Examples

### Hooks usage

:::demo-v2 Hooks usage. Request notification permission first; send only after the user allows it.

notification/hooks

:::

### Auto-close delay

:::demo-v2 Using `duration` to set the delay for automatic closing of the notification box.

notification/duration

:::

### Close a specific notification

:::demo-v2 Close the notification box with the specified `tag`.

notification/close_tag

:::

### Static methods

:::demo-v2 Static-method usage. Request notification permission before sending.

notification/static-method

:::

## API

Successfully sending notifications requires ensuring that the current domain has granted notification permissions.

### XNotification

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| permission | Indicates whether the current user has granted the current origin permission to display web notifications. | NotificationPermission | - | - |
| requestPermission | Requests permission from the user to display notifications for the current origin. | () => Promise\<NotificationPermission\> | - | - |
| open | Pushes a notification to the user | (config: XNotificationOpenArgs) => void | - | - |
| close | Closes sent notifications. You can pass a list of tags to close specific notifications; if no parameters are provided, all notifications will be closed | (config?: string[]) => void | - | - |

#### NotificationPermission

```typescript
type NotificationPermission =
  | 'granted' // 用户已明确授予当前源显示系统通知的权限。
  | 'denied' // 用户已明确拒绝当前源显示系统通知的权限。
  | 'default'; // 用户决定未知；在这种情况下，应用程序的行为就像权限被"拒绝"一样。
```

#### XNotificationOpenArgs

```typescript
type XNotificationOpenArgs = NotificationOptions & {
  title: string;
  onClick?: (event: Event, close?: Notification['close']) => void;
  onClose?: (event: Event) => void;
  onError?: (event: Event) => void;
  onShow?: (event: Event) => void;
  duration?: number;
};
```

#### NotificationOptions

```typescript
interface NotificationOptions {
  badge?: string;
  body?: string;
  data?: any;
  dir?: NotificationDirection;
  icon?: string;
  lang?: string;
  requireInteraction?: boolean;
  silent?: boolean | null;
  tag?: string;
}
```

### useNotification

```typescript
type useNotification = [
  { permission: NotificationPermission },
  {
    open: XNotification['open'];
    close: XNotification['close'];
    requestPermission: () => Promise<NotificationPermission>;
  },
];
```

## System permission settings

### Changing `Notification` Settings on Windows

The settings path varies across different versions of the Windows system, but you can roughly refer to the path: "Start" menu > "Settings" > "System" > then select "Notifications & actions" on the left side, where you can manage global notifications as well as app notifications.

### Changing `Notification` Settings on Mac

On Mac, use the "Notifications" settings to specify periods when you do not want to be disturbed by notifications and control how notifications appear in the "Notification Center." To change these settings, select the "Apple" menu > "System Settings," then click "Notifications" in the sidebar (you may need to scroll down).

## FAQ

### Already granted the current source `origin` permission to display system notifications, and the `onShow` callback was triggered, so why still can't show the pushed notification?

`Notification` is a system notification and you need to ensure the device has enabled the corresponding browser app's notification permissions.

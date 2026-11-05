<script setup lang="tsx">
defineOptions({ name: 'AXSenderSwitchV2' });

import { Sender } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';

const checked = ref(false);

defineRender(() => (
  <Flex vertical gap="middle">
    <Flex align="center" gap="small">
      Default: <Sender.Switch icon={<SearchOutlined />}>Deep Search</Sender.Switch>
    </Flex>
    <Flex align="center" gap="small">
      Custom checked/unchecked content:
      <Sender.Switch
        checkedChildren="Deep Search: on"
        unCheckedChildren="Deep Search: off"
        icon={<SearchOutlined />}
      />
    </Flex>
    <Flex align="center" gap="small">
      Disabled:
      <Sender.Switch disabled icon={<SearchOutlined />}>
        Deep Search
      </Sender.Switch>
    </Flex>
    <Flex align="center" gap="small">
      Loading:
      <Sender.Switch loading icon={<SearchOutlined />}>
        Deep Search
      </Sender.Switch>
    </Flex>
    <Flex align="center" gap="small">
      DefaultValue:
      <Sender.Switch
        icon={<SearchOutlined />}
        defaultValue={true}
        onChange={(v) => { console.log('Switch toggled', v); }}
      >
        Deep Search
      </Sender.Switch>
    </Flex>
    <Flex align="center" gap="small">
      Controlled mode:
      <Sender.Switch
        icon={<SearchOutlined />}
        value={checked.value}
        onChange={(v) => { checked.value = v; }}
      >
        Deep Search
      </Sender.Switch>
    </Flex>
  </Flex>
));
</script>

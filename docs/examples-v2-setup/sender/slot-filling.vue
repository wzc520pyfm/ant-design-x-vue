<script setup lang="tsx">
defineOptions({ name: 'AXSenderSlotFillingV2Setup' });

import { Sender } from 'ant-design-x-vue';
import type { SenderProps } from 'ant-design-x-vue';
import { Button, Flex, Slider } from 'ant-design-vue';
import { ref } from 'vue';

type SlotConfig = SenderProps['slotConfig'];

const otherSlotConfig: SlotConfig = [
  { type: 'text', value: 'I want to go to' },
  {
    type: 'select',
    key: 'destination',
    props: {
      defaultValue: 'Beijing',
      options: ['Beijing', 'Shanghai', 'Guangzhou'],
      placeholder: 'Please select a destination',
    },
  },
  { type: 'text', value: 'for a trip with ' },
  { type: 'tag', key: 'tag', props: { label: '@ Chuck', value: 'a man' } },
  { type: 'text', value: ', the date is ' },
  {
    type: 'input',
    key: 'date',
    props: { placeholder: 'Please enter a date' },
  },
  { type: 'text', value: ', and the price should be ' },
  {
    type: 'custom',
    key: 'priceRange',
    props: { defaultValue: [20, 50] },
    customRender: (value: any, onChange: (value: any) => void, props: any) => {
      return (
        <div style={{ width: '100px' }}>
          <Slider {...props} style={{ margin: 0 }} range value={value} onChange={onChange} />
        </div>
      );
    },
    formatResult: (value: any) => `between ${value[0]} and ${value[1]} RMB.`,
  },
  { type: 'text', value: ', and the number of people is ' },
  {
    type: 'input',
    key: 'numberOfPeople',
    props: { placeholder: 'Please enter a number' },
  },
];

const altSlotConfig: SlotConfig = [
  { type: 'text', value: 'My favorite city is ' },
  {
    type: 'select',
    key: 'city',
    props: {
      defaultValue: 'London',
      options: ['London', 'Paris', 'New York'],
      placeholder: 'Select a city',
    },
  },
  { type: 'text', value: ', and I want to travel with ' },
  { type: 'input', key: 'partner', props: { placeholder: 'Enter a name' } },
];

const slotConfigs = { otherSlotConfig, altSlotConfig };

const slotConfigKey = ref<keyof typeof slotConfigs | false>('otherSlotConfig');
const senderRef = ref<InstanceType<typeof Sender> | null>(null);
const displayValue = ref('');

const onClear = () => senderRef.value?.clear?.();
const onGetValue = () => {
  const val = senderRef.value?.getValue?.();
  displayValue.value = val?.value ? val.value : 'No value';
};
const onGetSlot = () => {
  const val = senderRef.value?.getValue?.();
  displayValue.value = val?.config ? JSON.stringify(val.config) : 'No value';
};
const onInsertText = () => {
  senderRef.value?.insert?.([{ type: 'text', value: ' some text ' }]);
};
const onInsertSlot = () => {
  senderRef.value?.insert?.([{
    type: 'input',
    key: `partner_2_${Date.now()}`,
    props: { placeholder: 'Enter a name' },
  }]);
};
const onInsertSlotStart = () => {
  senderRef.value?.insert?.(
    [{
      type: 'input',
      key: `partner_2_${Date.now()}`,
      props: { placeholder: 'Enter a name' },
    }],
    'start',
  );
};
const onInsertSlotEnd = () => {
  senderRef.value?.insert?.(
    [{
      type: 'input',
      key: `partner_3_${Date.now()}`,
      props: { placeholder: 'Enter a name' },
    }],
    'end',
  );
};
const onChangeConfig = () => {
  slotConfigKey.value = slotConfigKey.value === 'otherSlotConfig' ? 'altSlotConfig' : 'otherSlotConfig';
};
const onFocusFirst = () => {
  senderRef.value!.focus({ cursor: 'start' });
};
const onFocusLast = () => {
  senderRef.value!.focus({ cursor: 'end' });
};
const onFocusSlot = () => {
  senderRef.value!.focus({ cursor: 'slot' });
};
const onFocusSlotWithKey = () => {
  senderRef.value!.focus({ cursor: 'slot', key: 'numberOfPeople' });
};
const onFocusSelectAll = () => {
  senderRef.value!.focus({ cursor: 'all' });
};
const onFocusPreventScroll = () => {
  senderRef.value!.focus({ preventScroll: true });
};
const onBlur = () => {
  senderRef.value!.blur();
};
const onSubmit = (value: string) => {
  displayValue.value = value;
  slotConfigKey.value = false;
};
</script>

<template>
  <Flex vertical :gap="16">
    <Flex wrap :gap="8">
      <Button @click="onClear">Clear</Button>
      <Button @click="onGetValue">Get Value</Button>
      <Button @click="onGetSlot">Get Slot</Button>
      <Button @click="onInsertText">Insert Text</Button>
      <Button @click="onInsertSlot">Insert Slot</Button>
      <Button @click="onInsertSlotStart">Insert Slot Start</Button>
      <Button @click="onInsertSlotEnd">Insert Slot End</Button>
      <Button @click="onChangeConfig">Change SlotConfig</Button>
      <Button @click="onFocusFirst">Focus at first</Button>
      <Button @click="onFocusLast">Focus at last</Button>
      <Button @click="onFocusSlot">Focus at slot</Button>
      <Button @click="onFocusSlotWithKey">Focus at slot with key</Button>
      <Button @click="onFocusSelectAll">Focus to select all</Button>
      <Button @click="onFocusPreventScroll">Focus prevent scroll</Button>
      <Button @click="onBlur">Blur</Button>
    </Flex>
    <Sender
      ref="senderRef"
      :slot-config="slotConfigKey ? slotConfigs[slotConfigKey] : []"
      @submit="onSubmit"
    />
    <span v-if="displayValue">value: {{ displayValue }}</span>
  </Flex>
</template>

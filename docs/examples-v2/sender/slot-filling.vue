<script setup lang="tsx">
defineOptions({ name: 'AXSenderSlotFillingV2' });

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
    props: {
      placeholder: 'Please enter a date',
    },
  },
  { type: 'text', value: ', and the price should be ' },
  {
    type: 'custom',
    key: 'priceRange',
    props: {
      defaultValue: [20, 50],
    },
    customRender: (value: any, onChange: (value: any) => void, props: any) => {
      return (
        <div style={{ width: '100px' }}>
          <Slider {...props} style={{ margin: 0 }} range value={value} onChange={onChange} />
        </div>
      );
    },
    formatResult: (value: any) => {
      return `between ${value[0]} and ${value[1]} RMB.`;
    },
  },
  { type: 'text', value: ', and the number of people is ' },
  {
    type: 'input',
    key: 'numberOfPeople',
    props: {
      placeholder: 'Please enter a number',
    },
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

const slotConfigs = {
  otherSlotConfig,
  altSlotConfig,
};

const slotConfigKey = ref<keyof typeof slotConfigs | false>('otherSlotConfig');
const senderRef = ref<InstanceType<typeof Sender> | null>(null);
const displayValue = ref('');

defineRender(() => (
  <Flex vertical gap={16}>
    <Flex wrap="wrap" gap={8}>
      <Button onClick={() => { senderRef.value?.clear?.(); }}>
        Clear
      </Button>
      <Button onClick={() => {
        const val = senderRef.value?.getValue?.();
        displayValue.value = val?.value ? val.value : 'No value';
      }}>
        Get Value
      </Button>
      <Button onClick={() => {
        const val = senderRef.value?.getValue?.();
        displayValue.value = val?.config ? JSON.stringify(val.config) : 'No value';
      }}>
        Get Slot
      </Button>
      <Button onClick={() => {
        senderRef.value?.insert?.([{ type: 'text', value: ' some text ' }]);
      }}>
        Insert Text
      </Button>
      <Button onClick={() => {
        senderRef.value?.insert?.([{
          type: 'input',
          key: `partner_2_${Date.now()}`,
          props: { placeholder: 'Enter a name' },
        }]);
      }}>
        Insert Slot
      </Button>
      <Button onClick={() => {
        senderRef.value?.insert?.(
          [{
            type: 'input',
            key: `partner_2_${Date.now()}`,
            props: { placeholder: 'Enter a name' },
          }],
          'start',
        );
      }}>
        Insert Slot Start
      </Button>
      <Button onClick={() => {
        senderRef.value?.insert?.(
          [{
            type: 'input',
            key: `partner_3_${Date.now()}`,
            props: { placeholder: 'Enter a name' },
          }],
          'end',
        );
      }}>
        Insert Slot End
      </Button>
      <Button onClick={() => {
        slotConfigKey.value = slotConfigKey.value === 'otherSlotConfig' ? 'altSlotConfig' : 'otherSlotConfig';
      }}>
        Change SlotConfig
      </Button>
      <Button onClick={() => {
        senderRef.value!.focus({ cursor: 'start' });
      }}>
        Focus at first
      </Button>
      <Button onClick={() => {
        senderRef.value!.focus({ cursor: 'end' });
      }}>
        Focus at last
      </Button>
      <Button onClick={() => {
        senderRef.value!.focus({ cursor: 'slot' });
      }}>
        Focus at slot
      </Button>
      <Button onClick={() => {
        senderRef.value!.focus({ cursor: 'slot', key: 'numberOfPeople' });
      }}>
        Focus at slot with key
      </Button>
      <Button onClick={() => {
        senderRef.value!.focus({ cursor: 'all' });
      }}>
        Focus to select all
      </Button>
      <Button onClick={() => {
        senderRef.value!.focus({ preventScroll: true });
      }}>
        Focus prevent scroll
      </Button>
      <Button onClick={() => {
        senderRef.value!.blur();
      }}>
        Blur
      </Button>
    </Flex>
    <Sender
      ref={senderRef}
      onSubmit={(value) => {
        displayValue.value = value;
        slotConfigKey.value = false;
      }}
      slotConfig={slotConfigKey.value ? slotConfigs[slotConfigKey.value] : []}
    />
    {displayValue.value ? `value: ${displayValue.value}` : null}
  </Flex>
));
</script>

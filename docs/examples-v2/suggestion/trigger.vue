<script setup lang="tsx">
defineOptions({ name: 'AXSuggestionTriggerV2' });

import { Suggestion } from 'ant-design-x-vue';
import { Select } from 'ant-design-vue';
import { ref } from 'vue';

let uuid = 0;
const tags = ref<string[]>([]);
const value = ref('');

defineRender(() => (
  <Suggestion<string>
    items={(info) => [{ label: `Trigger by '${info}'`, value: String(info) }]}
    onSelect={(info) => {
      uuid += 1;
      tags.value = [...tags.value, `Cell_${uuid}`];
      value.value = value.value.replace(info, '');
    }}
    children={({ onTrigger, onKeyDown }) => (
      <Select
        value={tags.value}
        style={{ width: '100%' }}
        mode="tags"
        open={false}
        searchValue={value.value}
        onChange={(nextTags) => {
          if ((nextTags as string[]).length < tags.value.length) {
            tags.value = nextTags as string[];
          }
        }}
        onSearch={(nextVal) => {
          value.value = nextVal;
        }}
        onKeydown={(e) => {
          if (e.key === '/' || e.key === '#') {
            onTrigger(e.key);
          }
          onKeyDown(e);
        }}
        placeholder="可任意输入 / 与 # 多次获取建议"
      />
    )}
  />
));
</script>

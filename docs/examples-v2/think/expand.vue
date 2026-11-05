<script setup lang="tsx">
import { Button } from 'ant-design-vue';
import { Think } from 'ant-design-x-vue';
import { ref } from 'vue';

const value = ref(true);

defineRender(() => (
  <>
    <div>
      <Button onClick={() => (value.value = !value.value)}>Change expand</Button>
    </div>
    <br />
    <Think
      title="deep thinking"
      expanded={value.value}
      onExpand={(val: boolean) => {
        value.value = val;
      }}
    >
      This is deep thinking content.
    </Think>
  </>
));
</script>

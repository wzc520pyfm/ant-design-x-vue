<script setup lang="tsx">
defineOptions({ name: 'AXConversationsInfiniteLoadV2' });

import { ref, onMounted } from 'vue';
import { RedoOutlined } from '@ant-design/icons-vue';
import { Conversations, type ConversationsProps } from 'ant-design-x-vue';
import { Avatar, Divider, Spin, theme } from 'ant-design-vue';

type ConversationItem = NonNullable<ConversationsProps['items']>[number];

const loading = ref(false);
const data = ref<ConversationItem[]>([]);
const hasMore = ref(true);

const { token } = theme.useToken();

const style = {
  width: '280px',
  height: '600px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
  overflow: 'auto',
};

const loadMoreData = () => {
  if (loading.value) return;
  loading.value = true;
  fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
    .then((res) => res.json())
    .then((body) => {
      const formatted: ConversationItem[] = body.results.map((i: any) => ({
        key: i.email,
        label: `${i.name.title} ${i.name.first} ${i.name.last}`,
        icon: <Avatar src={i.picture.thumbnail} />,
        group: i.nat,
      }));
      data.value = [...data.value, ...formatted];
      if (data.value.length >= 50) hasMore.value = false;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};

const onScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
    if (hasMore.value && !loading.value) {
      loadMoreData();
    }
  }
};

onMounted(() => {
  loadMoreData();
});

defineRender(() => (
  <div style={style} onScroll={onScroll}>
    <Conversations items={data.value} defaultActiveKey="demo1" groupable />
    {loading.value && (
      <div style={{ textAlign: 'center', padding: '8px' }}>
        <Spin indicator={<RedoOutlined spin />} size="small" />
      </div>
    )}
    {!hasMore.value && (
      <Divider plain>It is all, nothing more</Divider>
    )}
  </div>
));
</script>

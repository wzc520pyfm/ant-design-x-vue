<script setup lang="tsx">
defineOptions({ name: 'AXSourcesIconV2' });

import { GithubOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons-vue';
import { Sources } from 'ant-design-x-vue';

const items = [
  {
    title: 'Data source from twitter',
    url: 'https://x.ant.design/components/overview',
    icon: <TwitterOutlined />,
  },
  {
    title: 'Data source from youtube',
    url: 'https://x.ant.design/components/overview',
    icon: <YoutubeOutlined />,
  },
  {
    title: 'Data source from github',
    url: 'https://x.ant.design/components/overview',
    icon: <GithubOutlined />,
  },
];

defineRender(() => (
  <Sources title="Used 3 sources" items={items} expandIconPosition="end" />
));
</script>

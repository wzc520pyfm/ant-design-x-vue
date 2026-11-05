<script setup lang="ts">
defineOptions({ name: 'AXSourcesIconV2Setup' });

import { GithubOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons-vue';
import { Sources, type SourcesItem } from 'ant-design-x-vue';
import { h } from 'vue';

const items: SourcesItem[] = [
  {
    title: 'Data source from twitter',
    url: 'https://x.ant.design/components/overview',
    icon: h(TwitterOutlined),
  },
  {
    title: 'Data source from youtube',
    url: 'https://x.ant.design/components/overview',
    icon: h(YoutubeOutlined),
  },
  {
    title: 'Data source from github',
    url: 'https://x.ant.design/components/overview',
    icon: h(GithubOutlined),
  },
];
</script>

<template>
  <Sources title="Used 3 sources" :items="items" expand-icon-position="end" />
</template>

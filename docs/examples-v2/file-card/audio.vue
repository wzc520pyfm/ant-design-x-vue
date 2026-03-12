<script setup lang="tsx">
import { FileCard } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';

defineRender(() => (
  <Flex vertical gap="middle">
    <FileCard
      name="audio-file.mp3"
      src="https://mdn.alipayobjects.com/cto_doraemon/afts/file/HFTcTLugiIAAAAAAgCAAAAgAehe3AQBr"
    />
    <FileCard
      name="video-file.mp4"
      src="https://mdn.alipayobjects.com/doraemon_plugin/afts/file/vl7tSa-m3jEAAAAAAAAAAAAAeur1AQBr"
    />
    <FileCard name="audio-file.mp3" byte={1024} type="file" />
    <FileCard name="video-file.mp4" byte={1024} type="file" />
  </Flex>
));
</script>

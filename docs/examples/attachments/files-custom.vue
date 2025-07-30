<script setup lang="tsx">
import { App, Flex } from 'ant-design-vue';
import { Attachments } from 'ant-design-x-vue';
import { VideoCameraFilled, AudioFilled, CopyFilled, FileImageFilled } from '@ant-design/icons-vue';
import type { VNode } from 'vue';

defineOptions({ name: 'AXAttachmentFiles' });

const Demo = () => {
  const filesList: {
    uid: string;
    name: string;
    size: number;
    description?: string;
    thumbUrl?: string;
    url?: string;
    icon?: VNode;
    type?: 'file' | 'image';
  }[] = [
    {
      uid: '1',
      name: 'excel-file.xlsx',
      size: 111111,
      icon: <CopyFilled />,
      type: 'file',
    },
    {
      uid: '2',
      name: 'image-file.png',
      size: 333333,
      icon: <FileImageFilled />,
      type: 'file',
    },
    {
      uid: '3',
      name: 'pdf-file.pdf',
      size: 444444,
      icon: <CopyFilled />,
      type: 'file',
    },
    {
      uid: '4',
      name: 'video-file.mp4',
      size: 666666,
      icon: <VideoCameraFilled />,
      type: 'file',
    },
    {
      uid: '5',
      name: 'audio-file.mp3',
      size: 777777,
      icon: <AudioFilled />,
      type: 'file',
    },
  ];

  return (
    <Flex vertical gap="middle">
      {filesList.map((file, index) => (
        <Attachments.FileCard key={index} item={file}  icon={file.icon} type={file.type} />
      ))}
    </Flex>
  );
};

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  )
});
</script>

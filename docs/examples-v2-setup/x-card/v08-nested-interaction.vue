<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_8,
} from '@ant-design-x-vue/x-card';
import {
  AccordionPanel,
  FileDetailCard,
  FileTree,
  MainContainer,
  PANEL_DATA,
  TextBlock,
} from './_shared';

const HEADER_TEXT =
  'Welcome to Project File Browser! Browse the project structure below. Click on files to view details, expand folders to explore nested contents.';

const commands = ref<XAgentCommand_v0_8[]>([]);

const append = (...next: XAgentCommand_v0_8[]) => {
  commands.value = [...commands.value, ...next];
};

const createBrowserCommands = (): XAgentCommand_v0_8[] => [
  {
    surfaceUpdate: {
      surfaceId: 'browser',
      components: [
        {
          id: 'title',
          component: {
            Text: {
              text: { literalString: 'Project File Browser' },
              variant: { literalString: 'h1' },
            },
          },
        },
        {
          id: 'file-tree',
          component: {
            FileTree: {
              action: {
                name: 'select_file',
                context: [{ key: 'selectedFile', value: { path: '/browser/selectedFile' } }],
              },
              selectedFile: { path: '/browser/selectedFile' },
            },
          },
        },
        {
          id: 'file-detail',
          component: {
            FileDetailCard: { file: { path: '/browser/selectedFile' } },
          },
        },
        {
          id: 'accordion-section',
          component: {
            AccordionPanel: { panels: { path: '/browser/panels' } },
          },
        },
        {
          id: 'root',
          component: {
            MainContainer: {
              children: {
                explicitList: ['title', 'file-tree', 'file-detail', 'accordion-section'],
              },
            },
          },
        },
      ],
    },
  },
  {
    dataModelUpdate: {
      surfaceId: 'browser',
      contents: [
        {
          key: 'panels',
          valueMap: PANEL_DATA.map((panel) => ({
            key: panel.id,
            valueString: JSON.stringify(panel),
          })),
        },
      ],
    },
  },
  { beginRendering: { surfaceId: 'browser', root: 'root' } },
];

const handleAction = (payload: ActionPayload) => {
  if (payload.name !== 'select_file') return;
  const selectedFile = (payload.context as Record<string, any>)?.selectedFile;
  if (!selectedFile) return;
  append({
    dataModelUpdate: {
      surfaceId: 'browser',
      contents: [
        {
          key: 'selectedFile',
          valueMap: Object.entries(selectedFile).map(([key, value]) => ({
            key,
            valueString: String(value),
          })),
        },
      ],
    },
  });
};

const reload = () => {
  append(
    { deleteSurface: { surfaceId: 'browser' } },
    ...createBrowserCommands(),
  );
};

onMounted(() => append(...createBrowserCommands()));
</script>

<template>
  <div>
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px">
      <button
        type="button"
        style="padding: 7px 13px; border: 0; border-radius: 7px; background: #1677ff; color: #fff; cursor: pointer"
        @click="reload"
      >
        Reload
      </button>
      <span style="color: #8c8c8c; font-size: 13px">v0.8 文件树、详情卡与手风琴面板嵌套交互</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959; margin-bottom: 10px">
      {{ HEADER_TEXT }}
    </div>

    <XCard.Box
      :commands="commands"
      :components="{
        Text: TextBlock,
        FileTree,
        FileDetailCard,
        AccordionPanel,
        MainContainer,
      }"
      :on-action="handleAction"
    >
      <XCard.Card id="browser" />
    </XCard.Box>
  </div>
</template>

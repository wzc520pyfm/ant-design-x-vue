<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  registerCatalog,
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_9,
} from '@ant-design-x-vue/x-card';
import {
  AccordionPanel,
  CATALOGS,
  FileDetailCard,
  FileTree,
  MainContainer,
  PANEL_DATA,
  TextBlock,
} from './_shared';

registerCatalog(CATALOGS.nested);

const HEADER_TEXT =
  'Welcome to Project File Browser! Browse the project structure below. Click on files to view details, expand folders to explore nested contents.';

const commands = ref<XAgentCommand_v0_9[]>([]);

const append = (...next: XAgentCommand_v0_9[]) => {
  commands.value = [...commands.value, ...next];
};

const createBrowserCommands = (): XAgentCommand_v0_9[] => [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'browser',
      catalogId: 'local://nested_interaction_catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'browser',
      components: [
        { id: 'title', component: 'Text', text: 'Project File Browser', variant: 'h1' },
        {
          id: 'file-tree',
          component: 'FileTree',
          selectedFile: { path: '/browser/selectedFile' },
          action: {
            event: {
              name: 'select_file',
              context: { selectedFile: { path: '/browser/selectedFile' } },
            },
          },
        },
        { id: 'file-detail', component: 'FileDetailCard', file: { path: '/browser/selectedFile' } },
        { id: 'accordion-section', component: 'AccordionPanel', panels: { path: '/browser/panels' } },
        {
          id: 'root',
          component: 'MainContainer',
          children: ['title', 'file-tree', 'file-detail', 'accordion-section'],
        },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'browser',
      path: '/browser',
      value: { panels: PANEL_DATA },
    },
  },
];

const handleAction = (payload: ActionPayload) => {
  if (payload.name !== 'select_file') return;
  const selectedFile = (payload.context as Record<string, any>)?.selectedFile;
  if (!selectedFile) return;
  append({
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'browser',
      path: '/browser/selectedFile',
      value: selectedFile,
    },
  });
};

const reload = () => {
  append(
    { version: 'v0.9', deleteSurface: { surfaceId: 'browser' } },
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
      <span style="color: #8c8c8c; font-size: 13px">展开目录、选择文件，详情与手风琴面板共享 dataModel</span>
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

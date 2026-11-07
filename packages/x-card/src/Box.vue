<script setup lang="ts">
import { computed, markRaw, provide, ref, watch, type Component } from 'vue';
import { loadCatalog, type Catalog } from './catalog';
import { boxContextKey } from './context';
import type { ActionPayload } from './types/box';
import type { A2UICommand_v0_9 } from './types/command_v0.9';
import type { XAgentCommand_v0_8 } from './types/command_v0.8';

defineOptions({ name: 'AXCardBox' });

const props = defineProps<{
  commands?: (A2UICommand_v0_9 | XAgentCommand_v0_8)[];
  components?: Record<string, any>;
  onAction?: (payload: ActionPayload) => void;
}>();

const rawComponents = computed(() => {
  const src = props.components || {};
  const next: Record<string, Component> = {};
  for (const [name, comp] of Object.entries(src)) {
    next[name] = markRaw(comp as Component);
  }
  return next;
});

const catalogMap = ref(new Map<string, Catalog>());
const surfaceCatalogMap = ref(new Map<string, string>());
const processedCommandsCount = ref(0);

watch(
  () => props.commands,
  (commands) => {
    if (!commands || commands.length === 0) {
      processedCommandsCount.value = 0;
      return;
    }
    if (commands.length < processedCommandsCount.value) {
      processedCommandsCount.value = 0;
    }
    const newCommands = commands.slice(processedCommandsCount.value);
    if (newCommands.length === 0) return;

    for (const cmd of newCommands) {
      if ('createSurface' in cmd) {
        const { surfaceId, catalogId } = (cmd as A2UICommand_v0_9 & { createSurface: any })
          .createSurface;
        if (catalogId) {
          if (surfaceCatalogMap.value.get(surfaceId) !== catalogId) {
            const next = new Map(surfaceCatalogMap.value);
            next.set(surfaceId, catalogId);
            surfaceCatalogMap.value = next;
          }
          loadCatalog(catalogId)
            .then((catalog) => {
              if (catalogMap.value.has(catalogId)) return;
              const next = new Map(catalogMap.value);
              next.set(catalogId, catalog);
              catalogMap.value = next;
            })
            .catch((error) => {
              console.error(`Failed to load catalog ${catalogId}:`, error);
            });
        }
      }
      if ('deleteSurface' in cmd) {
        const surfaceId = (cmd as { deleteSurface: { surfaceId: string } }).deleteSurface.surfaceId;
        if (surfaceCatalogMap.value.has(surfaceId)) {
          const next = new Map(surfaceCatalogMap.value);
          next.delete(surfaceId);
          surfaceCatalogMap.value = next;
        }
      }
    }
    processedCommandsCount.value = commands.length;
  },
  { immediate: true },
);

provide(
  boxContextKey,
  computed(() => ({
    components: rawComponents.value,
    commandQueue: props.commands || [],
    onAction: props.onAction,
    catalogMap: catalogMap.value,
    surfaceCatalogMap: surfaceCatalogMap.value,
  })) as any,
);
</script>

<template>
  <div class="ant-x-card-box">
    <slot />
  </div>
</template>

import { computed, defineComponent, h, inject, markRaw, ref, toRaw, unref, watch, type PropType, type VNode } from 'vue';
import { extractDataUpdatesV08, resolvePropsV08, applyDataModelUpdateV08, type ActionConfigV08 } from './Card.v0.8';
import { extractDataUpdatesV09, resolvePropsV09, applyDataModelUpdateV09, type ActionConfigV09 } from './Card.v0.9';
import { boxContextKey } from './context';
import { createComponentTransformer, type ComponentTree } from './format/components';
import { getValueByPath, isPathObject, setValueByPath, validateComponentAgainstCatalog } from './utils';
import type { ActionPayload } from './types/box';

export interface CardProps {
  id: string;
}

type ActionConfig = ActionConfigV08 | ActionConfigV09;

/**
 * Resolve path refs in action context to dataModel values.
 * v0.9: action.event.context = { key: { path, label? } }
 * v0.8: action.context = [{ key, value: { path } }]
 * componentContext wins over values resolved from config.
 */
function resolveActionContextPathRefs(
  actionConfig: any,
  componentContext: Record<string, any>,
  dataModel: Record<string, any>,
): Record<string, any> {
  if (!actionConfig) return componentContext;

  const v09Context = actionConfig?.event?.context;
  if (v09Context && typeof v09Context === 'object' && !Array.isArray(v09Context)) {
    const resolvedFromConfig: Record<string, any> = {};
    for (const [key, val] of Object.entries(v09Context)) {
      if (isPathObject(val)) {
        const actualValue = getValueByPath(dataModel, (val as { path: string }).path);
        const { path, ...rest } = val as { path: string; [key: string]: any };
        resolvedFromConfig[key] = { ...rest, value: actualValue };
      } else {
        resolvedFromConfig[key] = val;
      }
    }
    return { ...resolvedFromConfig, ...componentContext };
  }

  const v08Context = actionConfig?.context;
  if (Array.isArray(v08Context)) {
    const resolvedFromConfig: Record<string, any> = {};
    for (const item of v08Context) {
      const { key, value: val } = item as { key: string; value: any };
      if (key === undefined) continue;
      if (isPathObject(val)) {
        resolvedFromConfig[key] = { value: getValueByPath(dataModel, (val as { path: string }).path) };
      } else {
        resolvedFromConfig[key] = val;
      }
    }
    return { ...resolvedFromConfig, ...componentContext };
  }

  return componentContext;
}

const NodeRenderer = defineComponent({
  name: 'AXCardNodeRenderer',
  props: {
    nodeId: { type: String, required: true },
    transformer: { type: Object as PropType<ReturnType<typeof createComponentTransformer>>, required: true },
    components: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    dataModel: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    catalog: { type: Object as PropType<any>, default: undefined },
    commandVersion: { type: String as PropType<'v0.8' | 'v0.9'>, default: 'v0.8' },
    onAction: { type: Function as PropType<(name: string, context: Record<string, any>, actionConfig?: any) => void> },
    onDataChange: { type: Function as PropType<(path: string, value: any) => void> },
    treeEpoch: { type: Number, default: 0 },
  },
  setup(props) {
    return () => {
      const node = props.transformer.getById(props.nodeId) as ComponentTree | undefined;
      if (!node) return null;

      const validation = validateComponentAgainstCatalog(props.catalog, node.type, node.props);
      if ((!validation.valid || validation.errors.length > 0) && process.env.NODE_ENV === 'development') {
        validation.errors.forEach((error) => console.warn(error));
      }

      const raw = props.components?.[node.type];
      if (!raw) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Component "${node.type}" is not registered. It will not be rendered.`);
        }
        return null;
      }

      const resolvedProps =
        props.commandVersion === 'v0.9'
          ? resolvePropsV09(node.props || {}, props.dataModel)
          : resolvePropsV08(node.props || {}, props.dataModel);

      resolvedProps.onAction = (name: string, context: Record<string, any> = {}) => {
        props.onAction?.(name, context, resolvedProps.action);
      };
      resolvedProps.onDataChange = props.onDataChange;

      const children = (node.children || []).map((childId) =>
        h(NodeRenderer, {
          key: childId,
          nodeId: childId,
          transformer: props.transformer,
          components: props.components,
          dataModel: props.dataModel,
          catalog: props.catalog,
          commandVersion: props.commandVersion,
          onAction: props.onAction,
          onDataChange: props.onDataChange,
          treeEpoch: props.treeEpoch,
        }),
      );

      const Component = markRaw(toRaw(raw));
      return h(Component, resolvedProps, { default: () => children });
    };
  },
});

const Card = defineComponent({
  name: 'AXCard',
  props: {
    id: { type: String, required: true },
  },
  setup(props) {
    const injected = inject(boxContextKey, null);
    const box = computed(() => (injected ? unref(injected as any) : null));

    const transformer = createComponentTransformer();
    const rootNode = ref<ComponentTree | null>(null);
    const treeEpoch = ref(0);
    const dataModel = ref<Record<string, any>>({});
    const hasRendered = ref(false);
    const commandVersion = ref<'v0.8' | 'v0.9'>('v0.8');
    const pendingRootId = ref<string | null>(null);
    const renderedRootId = ref('root');

    const processCommands = () => {
      const ctx = box.value;
      if (!ctx) return;
      const myCommands = (ctx.commandQueue || []).filter((cmd: any) => {
        if ('createSurface' in cmd) return cmd.createSurface.surfaceId === props.id;
        if ('updateComponents' in cmd) return cmd.updateComponents.surfaceId === props.id;
        if ('updateDataModel' in cmd) return cmd.updateDataModel.surfaceId === props.id;
        if ('deleteSurface' in cmd) return cmd.deleteSurface.surfaceId === props.id;
        if ('surfaceUpdate' in cmd) return cmd.surfaceUpdate.surfaceId === props.id;
        if ('dataModelUpdate' in cmd) return cmd.dataModelUpdate.surfaceId === props.id;
        if ('beginRendering' in cmd) return cmd.beginRendering.surfaceId === props.id;
        return false;
      });

      if (myCommands.length === 0) return;

      let nextDataModel = dataModel.value;
      let nextRoot = rootNode.value;
      let nextVersion = commandVersion.value;
      let dataChanged = false;
      let rootChanged = false;

      for (const cmd of myCommands) {
        if ('version' in cmd && (cmd as any).version === 'v0.9') {
          nextVersion = 'v0.9';
          if ('createSurface' in cmd && !hasRendered.value) {
            nextRoot = null;
            nextDataModel = {};
            rootChanged = true;
            dataChanged = true;
          }
          if ('updateComponents' in cmd) {
            const nodeTree = transformer.transform((cmd as any).updateComponents.components, 'v0.9');
            if (nodeTree) {
              nextRoot = nodeTree;
              renderedRootId.value = 'root';
              hasRendered.value = true;
              rootChanged = true;
            }
          }
          if ('updateDataModel' in cmd) {
            const { path, value } = (cmd as any).updateDataModel;
            nextDataModel = applyDataModelUpdateV09(nextDataModel, path, value);
            dataChanged = true;
          }
          if ('deleteSurface' in cmd) {
            nextRoot = null;
            nextDataModel = {};
            hasRendered.value = false;
            pendingRootId.value = null;
            rootChanged = true;
            dataChanged = true;
            transformer.reset();
          }
          continue;
        }

        nextVersion = 'v0.8';

        if ('surfaceUpdate' in cmd) {
          transformer.transform((cmd as any).surfaceUpdate.components, 'v0.8');
          if (hasRendered.value) {
            const cached = transformer.getById('root');
            if (cached) {
              nextRoot = cached;
              renderedRootId.value = 'root';
              rootChanged = true;
            }
          }
          if (pendingRootId.value) {
            const pending = transformer.getById(pendingRootId.value);
            if (pending) {
              nextRoot = pending;
              renderedRootId.value = pendingRootId.value || 'root';
              hasRendered.value = true;
              pendingRootId.value = null;
              rootChanged = true;
            }
          }
        }
        if ('dataModelUpdate' in cmd) {
          nextDataModel = applyDataModelUpdateV08(nextDataModel, (cmd as any).dataModelUpdate.contents);
          dataChanged = true;
        }
        if ('beginRendering' in cmd) {
          const { root } = (cmd as any).beginRendering;
          const nodeTree = transformer.getById(root);
          if (nodeTree) {
            nextRoot = nodeTree;
            renderedRootId.value = root;
            hasRendered.value = true;
            pendingRootId.value = null;
            rootChanged = true;
          } else {
            pendingRootId.value = root;
          }
        }
        if ('deleteSurface' in cmd) {
          nextRoot = null;
          nextDataModel = {};
          hasRendered.value = false;
          pendingRootId.value = null;
          rootChanged = true;
          dataChanged = true;
          transformer.reset();
        }
      }

      if (nextVersion !== commandVersion.value) commandVersion.value = nextVersion;
      if (rootChanged) {
        rootNode.value = nextRoot;
        // transformer mutates in place; bump a prop so NodeRenderer re-reads the tree
        treeEpoch.value += 1;
      }
      if (dataChanged) dataModel.value = nextDataModel;
    };

    watch(
      () => [box.value?.commandQueue, props.id],
      () => processCommands(),
      { immediate: true },
    );

    const catalog = computed(() => {
      const ctx = box.value;
      if (!ctx) return undefined;
      const catalogId = ctx.surfaceCatalogMap.get(props.id);
      return catalogId ? ctx.catalogMap.get(catalogId) : undefined;
    });

    const handleAction = (name: string, context: Record<string, any>, actionConfig?: ActionConfig) => {
      const dataUpdates =
        commandVersion.value === 'v0.9'
          ? extractDataUpdatesV09(actionConfig, context)
          : extractDataUpdatesV08(actionConfig, context);

      let next = dataModel.value;
      if (dataUpdates.length > 0) {
        next = dataUpdates.reduce((prev, { path, value }) => setValueByPath(prev, path, value), next);
        dataModel.value = next;
      }

      const payload: ActionPayload = {
        name,
        surfaceId: props.id,
        context: resolveActionContextPathRefs(actionConfig, context, next),
      };
      box.value?.onAction?.(payload);
    };

    const handleDataChange = (path: string, value: any) => {
      dataModel.value = setValueByPath(dataModel.value, path, value);
    };

    return () => {
      if (!rootNode.value) return null as unknown as VNode;
      return h(NodeRenderer, {
        nodeId: renderedRootId.value,
        transformer,
        components: box.value?.components || {},
        dataModel: dataModel.value,
        catalog: catalog.value,
        commandVersion: commandVersion.value,
        onAction: handleAction,
        onDataChange: handleDataChange,
        treeEpoch: treeEpoch.value,
      });
    };
  },
});

export default Card;

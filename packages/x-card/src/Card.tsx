import { computed, defineComponent, h, inject, markRaw, ref, toRaw, unref, watch, type PropType, type VNode } from 'vue';
import { boxContextKey } from './context';
import { createComponentTransformer, type ComponentTree } from './format/components';
import { applyDataModelUpdateV09 } from './resolve-v09';
import { getValueByPath, isPathValue, setValueByPath, validateComponentAgainstCatalog } from './utils';
import type { ActionPayload } from './types/box';

export interface CardProps {
  id: string;
}

function resolveValue(val: any, dataModel: Record<string, any>): any {
  if (isPathValue(val)) return getValueByPath(dataModel, val);
  if (Array.isArray(val)) return val.map((item) => resolveValue(item, dataModel));
  if (val && typeof val === 'object') {
    const next: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      next[k] = k === 'context' && val.event ? v : resolveValue(v, dataModel);
    }
    return next;
  }
  return val;
}

function resolveProps(props: Record<string, any>, dataModel: Record<string, any>) {
  const resolved: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    if (key === 'action') {
      resolved[key] = val;
    } else {
      resolved[key] = resolveValue(val, dataModel);
    }
  }
  return resolved;
}

const NodeRenderer = defineComponent({
  name: 'AXCardNodeRenderer',
  props: {
    nodeId: { type: String, required: true },
    transformer: { type: Object as PropType<ReturnType<typeof createComponentTransformer>>, required: true },
    components: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    dataModel: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    catalog: { type: Object as PropType<any>, default: undefined },
    onAction: { type: Function as PropType<(name: string, context: Record<string, any>, actionConfig?: any) => void> },
    onDataChange: { type: Function as PropType<(path: string, value: any) => void> },
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

      const resolvedProps = resolveProps(node.props || {}, props.dataModel);
      const children = (node.children || []).map((childId) =>
        h(NodeRenderer, {
          key: childId,
          nodeId: childId,
          transformer: props.transformer,
          components: props.components,
          dataModel: props.dataModel,
          catalog: props.catalog,
          onAction: props.onAction,
          onDataChange: props.onDataChange,
        }),
      );

      const Component = markRaw(toRaw(raw));
      return h(
        Component,
        {
          ...resolvedProps,
          onAction: (name: string, context: Record<string, any> = {}) => {
            props.onAction?.(name, context, resolvedProps.action);
          },
        },
        { default: () => children },
      );
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
    const dataModel = ref<Record<string, any>>({});
    const hasRendered = ref(false);

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
      let dataChanged = false;
      let rootChanged = false;

      for (const cmd of myCommands) {
        if ('version' in cmd && (cmd as any).version === 'v0.9') {
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
            rootChanged = true;
            dataChanged = true;
            transformer.reset();
          }
          continue;
        }

        if ('surfaceUpdate' in cmd) {
          const nodeTree = transformer.transform((cmd as any).surfaceUpdate.components, 'v0.8');
          if (hasRendered.value) {
            const cached = transformer.getById('root');
            if (cached) {
              nextRoot = cached;
              rootChanged = true;
            }
          } else if (nodeTree) {
            nextRoot = nodeTree;
            hasRendered.value = true;
            rootChanged = true;
          }
        }
        if ('beginRendering' in cmd) {
          const { root } = (cmd as any).beginRendering;
          const nodeTree = transformer.getById(root);
          if (nodeTree) {
            nextRoot = nodeTree;
            hasRendered.value = true;
            rootChanged = true;
          }
        }
        if ('deleteSurface' in cmd) {
          nextRoot = null;
          nextDataModel = {};
          hasRendered.value = false;
          rootChanged = true;
          dataChanged = true;
          transformer.reset();
        }
      }

      if (rootChanged) rootNode.value = nextRoot;
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

    const handleAction = (name: string, context: Record<string, any>, actionConfig?: any) => {
      let next = dataModel.value;
      const eventContext = actionConfig?.event?.context;
      if (eventContext && typeof eventContext === 'object' && !Array.isArray(eventContext)) {
        for (const [key, val] of Object.entries(eventContext)) {
          if (val && typeof val === 'object' && typeof (val as any).path === 'string' && context[key] !== undefined) {
            next = setValueByPath(next, (val as any).path, context[key]);
          }
        }
        dataModel.value = next;
      }
      const payload: ActionPayload = { name, surfaceId: props.id, context };
      box.value?.onAction?.(payload);
    };

    const handleDataChange = (path: string, value: any) => {
      dataModel.value = setValueByPath(dataModel.value, path, value);
    };

    return () => {
      if (!rootNode.value) return null as unknown as VNode;
      return h(NodeRenderer, {
        nodeId: 'root',
        transformer,
        components: box.value?.components || {},
        dataModel: dataModel.value,
        catalog: catalog.value,
        onAction: handleAction,
        onDataChange: handleDataChange,
      });
    };
  },
});

export default Card;

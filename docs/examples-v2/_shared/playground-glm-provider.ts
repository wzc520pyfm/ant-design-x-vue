import {
  DeepSeekChatProvider,
  XRequest,
  type SSEFields,
  type XModelParams,
  type XModelResponse,
} from 'ant-design-x-vue';

/** Public Ant Design X demo endpoint used by React `@ant-design/x` 2.10 playgrounds. */
export const PLAYGROUND_GLM_URL = 'https://api.x.ant.design/api/big_model_glm-4.5-flash';
export const PLAYGROUND_GLM_MODEL = 'glm-4.5-flash';

export type PlaygroundGlmProvider = DeepSeekChatProvider;

/**
 * One DeepSeekChatProvider per conversation key (React playground parity).
 */
export function createGlmProviderFactory(options?: {
  thinkingDisabled?: boolean;
}) {
  const caches = new Map<string, DeepSeekChatProvider>();
  const thinkingDisabled = options?.thinkingDisabled ?? false;

  const factory = (conversationKey: string) => {
    const key = conversationKey || 'default';
    let provider = caches.get(key);
    if (!provider) {
      provider = new DeepSeekChatProvider({
        request: XRequest<XModelParams, Partial<Record<SSEFields, XModelResponse>>>(
          PLAYGROUND_GLM_URL,
          {
            manual: true,
            params: {
              stream: true,
              model: PLAYGROUND_GLM_MODEL,
              ...(thinkingDisabled
                ? { thinking: { type: 'disabled' as const } }
                : {}),
            },
          },
        ),
      });
      caches.set(key, provider);
    }
    return provider;
  };

  factory.caches = caches;
  return factory as ((conversationKey: string) => DeepSeekChatProvider) & {
    caches: Map<string, DeepSeekChatProvider>;
  };
}

/**
 * Stable provider instance for Vue `useXChat` (setup runs once).
 * Delegates to the per-conversation cached provider from `getConversationKey()`.
 */
export function createLiveGlmProvider(
  getConversationKey: () => string,
  options?: { thinkingDisabled?: boolean },
): DeepSeekChatProvider {
  const factory = createGlmProviderFactory(options);
  const getMessagesFns = new Set<() => any>();

  const current = () => {
    const provider = factory(getConversationKey());
    getMessagesFns.forEach((fn) => provider.injectGetMessages(fn));
    return provider;
  };

  const seed = factory('__playground_glm_seed__');

  const requestFacade = {
    get manual() {
      return current().request.manual;
    },
    get options() {
      return current().request.options;
    },
    get baseURL() {
      return (current().request as any).baseURL;
    },
    get isRequesting() {
      return current().request.isRequesting;
    },
    get asyncHandler() {
      return (current().request as any).asyncHandler;
    },
    abort(...args: any[]) {
      return (current().request.abort as any)(...args);
    },
    run(...args: any[]) {
      return (current().request.run as any)(...args);
    },
  };

  return new Proxy(seed, {
    get(_target, prop) {
      if (prop === 'request') {
        return requestFacade;
      }
      if (prop === 'injectGetMessages') {
        return (fn: () => any) => {
          getMessagesFns.add(fn);
          current().injectGetMessages(fn);
        };
      }
      const provider = current();
      const value = (provider as any)[prop];
      return typeof value === 'function' ? value.bind(provider) : value;
    },
  }) as DeepSeekChatProvider;
}

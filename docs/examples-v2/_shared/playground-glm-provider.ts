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

  return (conversationKey: string) => {
    let provider = caches.get(conversationKey);
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
      caches.set(conversationKey, provider);
    }
    return provider;
  };
}

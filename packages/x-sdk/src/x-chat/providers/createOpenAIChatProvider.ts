import XRequest from '../../x-request';
import type { XModelMessage, XModelParams } from './types/model';
import OpenAIChatProvider from './OpenAIChatProvider';

/**
 * 1.x `useXAgent({ baseURL, model, dangerouslyApiKey | key })` preset.
 * 2.0 sends that through `OpenAIChatProvider` and a manual `XRequest`.
 */
export interface OpenAIPresetConfig {
  /** Chat Completions URL, for example `https://api.openai.com/v1/chat/completions`. */
  baseURL: string;
  model?: string;
  /**
   * Client-side credential. Prefer a backend proxy.
   * A raw token is sent as `Bearer <token>`. Values that already start with
   * `Bearer `, `Basic `, or `Tbox-` are sent unchanged.
   */
  dangerouslyApiKey?: string;
  /** Alias of `dangerouslyApiKey`, kept from the 1.x preset config. */
  key?: string;
  /**
   * Optional fetch implementation. Docs and tests pass a mock.
   * Production calls use the platform `fetch`.
   */
  fetch?: (baseURL: Parameters<typeof fetch>[0], options: { body?: BodyInit | null }) => Promise<Response>;
}

export function resolvePresetApiKey(config: {
  dangerouslyApiKey?: string;
  key?: string;
}): string | undefined {
  const secret = config.dangerouslyApiKey || config.key;
  if (!secret) return undefined;
  return /^(Bearer |Basic |Tbox-)/.test(secret) ? secret : `Bearer ${secret}`;
}

export function createOpenAIChatProvider<
  ChatMessage extends XModelMessage = XModelMessage,
  Input extends XModelParams = XModelParams,
>(config: OpenAIPresetConfig) {
  const authorization = resolvePresetApiKey(config);
  return new OpenAIChatProvider<ChatMessage, Input>({
    request: XRequest<Input>(config.baseURL, {
      manual: true,
      params: {
        ...(config.model ? { model: config.model } : {}),
        stream: true,
      } as Input,
      headers: authorization ? { Authorization: authorization } : {},
      // `fetch` is invariant in XRequest's generic options; the preset only needs the body.
      ...(config.fetch ? { fetch: config.fetch as never } : {}),
    }),
  });
}

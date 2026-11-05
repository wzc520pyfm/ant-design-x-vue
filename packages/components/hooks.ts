export * from './notification';
export * from './use-x-agent';

/**
 * 1.x chat hook kept so existing demos keep running.
 * 2.0 `useXChat` is the SDK hook and requires a Chat Provider.
 * @deprecated Use `useXChat` from the 2.0 SDK.
 */
export { useXChat as useLegacyXChat } from './use-x-chat';

/**
 * 1.x request helper (`XRequest({ baseURL, model })`).
 * 2.0 `XRequest` is `XRequest(baseURL, options)`.
 * @deprecated Use `XRequest` from the 2.0 SDK.
 */
export { XRequest as XRequestLegacy } from './x-request';

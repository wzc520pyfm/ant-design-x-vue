import {
  useXChat as sdkUseXChat,
  XRequest as sdkXRequest,
  XStream as sdkXStream,
} from '@ant-design-x-vue/x-sdk';
import { mount } from '@vue/test-utils';
import {
  DefaultChatProvider,
  useLegacyXChat,
  useXChat,
  useXConversations,
  XRequest,
  XRequestLegacy,
  XStream,
} from 'ant-design-x-vue';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

describe('ant-design-x-vue 2.0 runtime exports', () => {
  it('exposes the SDK chat, request, and stream implementations', () => {
    expect(useXChat).toBe(sdkUseXChat);
    expect(XRequest).toBe(sdkXRequest);
    expect(XStream).toBe(sdkXStream);
    expect(useLegacyXChat).not.toBe(useXChat);
    expect(XRequestLegacy).not.toBe(XRequest);
  });

  it('useXChat follows the provider contract and keeps the 1.x hook beside it', () => {
    const Probe = defineComponent({
      name: 'SdkRuntimeProbe',
      setup() {
        const sdk = useXChat({});
        const conversations = useXConversations({
          defaultConversations: [{ key: '1' }],
          defaultActiveConversationKey: '1',
        });
        const legacy = useLegacyXChat({
          agent: { request() {} } as never,
        });
        const request = XRequest('https://example.com/v1/chat/completions', {
          manual: true,
        });
        const legacyRequest = XRequestLegacy({
          baseURL: 'https://example.com/v1/chat',
          model: 'gpt-3.5-turbo',
        });
        return { sdk, conversations, legacy, request, legacyRequest };
      },
      template: '<div />',
    });

    const wrapper = mount(Probe);
    const vm = wrapper.vm as unknown as {
      sdk: {
        onRequest: (params: Record<string, never>) => void;
        onReload: unknown;
        abort: unknown;
        isRequesting: { value: boolean };
      };
      conversations: { conversations: { value: Array<{ key: string }> } };
      legacy: { onRequest: unknown; onReload?: unknown; abort?: unknown };
      request: { manual: boolean; abort: () => void };
      legacyRequest: { value?: { create: unknown }; create?: unknown };
    };

    expect(typeof vm.sdk.onReload).toBe('function');
    expect(typeof vm.sdk.abort).toBe('function');
    expect(vm.sdk.isRequesting.value).toBe(false);
    expect(() => vm.sdk.onRequest({})).toThrow(/provider is required/);
    expect(
      () =>
        new DefaultChatProvider({
          request: XRequest('https://example.com/v1/chat/completions', {
            manual: false,
          }),
        }),
    ).toThrow(/request must be manual/);
    expect(vm.conversations.conversations.value[0]?.key).toBe('1');
    expect(vm.legacy.onReload).toBeUndefined();
    expect(vm.legacy.abort).toBeUndefined();
    expect(vm.request.manual).toBe(true);
    expect(typeof vm.request.abort).toBe('function');
    const legacyRequest = vm.legacyRequest.value ?? vm.legacyRequest;
    expect(typeof legacyRequest.create).toBe('function');
    wrapper.unmount();
  });
});

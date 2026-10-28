import { mount } from '@vue/test-utils';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';
import Conversations from '../../conversations';
import en_US from '../../locale/en_US';
import zh_CN from '../../locale/zh_CN';
import XProvider from '../index.vue';

describe('XProvider locale', () => {
  it('switches the conversations creation label', () => {
    const child = () =>
      h(Conversations, {
        creation: { onClick: () => {} },
        items: [],
      });

    const zh = mount(XProvider, {
      props: {
        locale: { ...zhCN, ...zh_CN },
      },
      slots: {
        default: child,
      },
    });
    expect(zh.text()).toContain('新对话');
    zh.unmount();

    const en = mount(XProvider, {
      props: {
        locale: { ...zhCN, ...en_US },
      },
      slots: {
        default: child,
      },
    });
    expect(en.text()).toContain('New chat');
    en.unmount();
  });
});

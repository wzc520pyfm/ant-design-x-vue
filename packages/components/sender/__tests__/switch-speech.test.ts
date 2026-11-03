import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref, h } from 'vue';
import { Sender, SenderSwitch } from '../index';
import SpeechButton from '../components/SpeechButton/index.vue';
import { ActionButtonContextProvider } from '../components/ActionButton/context';

function collectedCss() {
  return Array.from(document.querySelectorAll('style'))
    .map((node) => node.textContent || '')
    .join('\n');
}

describe('SenderSwitch checked styles', () => {
  it('toggles with defaultValue when value prop is absent', async () => {
    const onChange = vi.fn();
    const wrapper = mount(SenderSwitch, {
      props: {
        defaultValue: false,
        onChange,
      },
      slots: {
        checkedChildren: () => 'Deep Think: on',
        unCheckedChildren: () => 'Deep Think: off',
      },
    });

    await nextTick();
    expect(wrapper.props('value')).toBeUndefined();
    expect(wrapper.find('.ant-sender-switch').classes()).not.toContain(
      'ant-sender-switch-checked',
    );

    const btn = wrapper.find('button.ant-btn');
    expect(btn.classes().join(' ')).toContain('ant-sender-switch-content');

    await btn.trigger('click');
    await nextTick();

    expect(wrapper.find('.ant-sender-switch').classes()).toContain(
      'ant-sender-switch-checked',
    );
    expect(onChange).toHaveBeenCalledWith(true);
    expect(btn.text()).toContain('Deep Think: on');

    const css = collectedCss();
    // Checked look must target real .ant-btn (antd-vue has no color/variant).
    expect(css).toMatch(
      /\.ant-sender-switch-checked[^]*?\.ant-btn\{[^}]*border-color:[^;}]*#1677ff/,
    );
    expect(css).toMatch(
      /\.ant-sender-switch-checked[^]*?\.ant-btn\{[^}]*background:[^;}]*rgba\(22,119,255/,
    );

    wrapper.unmount();
  });

  it('keeps controlled checked state from value prop', async () => {
    const checked = ref(true);
    const wrapper = mount(SenderSwitch, {
      props: {
        value: checked.value,
        onChange: (v: boolean) => {
          checked.value = v;
        },
      },
      slots: {
        checkedChildren: () => 'on',
        unCheckedChildren: () => 'off',
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-sender-switch').classes()).toContain(
      'ant-sender-switch-checked',
    );
    expect(wrapper.text()).toContain('on');
    wrapper.unmount();
  });
});

describe('SpeechButton recording icon', () => {
  it('injects centered recording-icon styles', async () => {
    const wrapper = mount(Sender, {
      props: {
        allowSpeech: true,
      },
    });
    await nextTick();

    const css = collectedCss();
    expect(css).toMatch(
      /\.ant-sender-actions-btn-recording-icon\{[^}]*display:block/,
    );
    expect(css).toMatch(
      /\.ant-sender-actions-btn-recording-icon\{[^}]*margin:auto/,
    );
    expect(css).toMatch(
      /\.ant-sender-actions-btn\{[^}]*justify-content:center/,
    );
    expect(css).toMatch(
      /\.ant-sender-actions-btn\{[^}]*align-items:center/,
    );

    wrapper.unmount();
  });

  it('renders recording waveform via Button icon when speechRecording', async () => {
    const Wrapper = {
      setup() {
        return () =>
          h(
            ActionButtonContextProvider,
            {
              value: {
                prefixCls: 'ant-sender-actions-btn',
                speechRecording: true,
                onSpeech: () => {},
              },
            },
            { default: () => h(SpeechButton) },
          );
      },
    };

    const wrapper = mount(Wrapper);
    await nextTick();

    const svg = wrapper.find('svg.ant-sender-actions-btn-recording-icon');
    expect(svg.exists()).toBe(true);
    expect(wrapper.find('button.ant-btn').exists()).toBe(true);
    expect(wrapper.find('button.ant-btn svg').exists()).toBe(true);

    wrapper.unmount();
  });
});

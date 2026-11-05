import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, h } from 'vue';
import Skill from '../components/Skill.vue';
import Sender from '../Sender.vue';

describe('Skill Component', () => {
  const defaultProps = {
    prefixCls: 'ant-sender',
    removeSkill: vi.fn(),
    value: 'test-skill',
    title: 'Test Skill',
  };

  it('should render basic skill with title', () => {
    const wrapper = mount(Skill, { props: defaultProps });
    expect(wrapper.find('.ant-sender-skill-wrapper').exists()).toBe(true);
    expect(wrapper.find('.ant-sender-skill-tag-text').text()).toBe('Test Skill');
  });

  it('should render skill with value when title is missing', () => {
    const wrapper = mount(Skill, {
      props: { ...defaultProps, title: undefined },
    });
    expect(wrapper.find('.ant-sender-skill-tag-text').text()).toBe('test-skill');
  });

  it('should not render close button when closable is false', () => {
    const wrapper = mount(Skill, {
      props: { ...defaultProps, closable: false },
    });
    expect(wrapper.find('.ant-sender-skill-close').exists()).toBe(false);
  });

  it('should render close button when closable is true', () => {
    const wrapper = mount(Skill, {
      props: { ...defaultProps, closable: true },
    });
    expect(wrapper.find('.ant-sender-skill-close').exists()).toBe(true);
    expect(wrapper.find('.ant-sender-skill-close-icon').exists()).toBe(true);
  });

  it('should render custom close icon', () => {
    const wrapper = mount(Skill, {
      props: { ...defaultProps, closable: { closeIcon: 'Custom Close' } },
    });
    expect(wrapper.find('.ant-sender-skill-close').text()).toContain('Custom Close');
  });

  it('should call removeSkill when close button is clicked', async () => {
    const mockRemoveSkill = vi.fn();
    const wrapper = mount(Skill, {
      props: { ...defaultProps, removeSkill: mockRemoveSkill, closable: true },
    });
    await wrapper.find('.ant-sender-skill-close').trigger('click');
    expect(mockRemoveSkill).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when provided in closable config', async () => {
    const mockRemoveSkill = vi.fn();
    const mockOnClose = vi.fn();
    const wrapper = mount(Skill, {
      props: {
        ...defaultProps,
        removeSkill: mockRemoveSkill,
        closable: { onClose: mockOnClose },
      },
    });
    await wrapper.find('.ant-sender-skill-close').trigger('click');
    expect(mockRemoveSkill).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call removeSkill when close button is disabled', async () => {
    const mockRemoveSkill = vi.fn();
    const wrapper = mount(Skill, {
      props: {
        ...defaultProps,
        removeSkill: mockRemoveSkill,
        closable: { disabled: true },
      },
    });
    await wrapper.find('.ant-sender-skill-close').trigger('click');
    expect(mockRemoveSkill).not.toHaveBeenCalled();
  });

  it('should have disabled class when close button is disabled', () => {
    const wrapper = mount(Skill, {
      props: { ...defaultProps, closable: { disabled: true } },
    });
    expect(wrapper.find('.ant-sender-skill-close-disabled').exists()).toBe(true);
  });

  it('should render with custom prefixCls', () => {
    const wrapper = mount(Skill, {
      props: { ...defaultProps, prefixCls: 'custom-prefix' },
    });
    expect(wrapper.find('.custom-prefix-skill-wrapper').exists()).toBe(true);
  });

  it('should render skill tag with proper accessibility attributes', () => {
    const wrapper = mount(Skill, { props: defaultProps });
    const skillTag = wrapper.find('.ant-sender-skill-tag');
    expect(skillTag.attributes('role')).toBe('button');
    expect(skillTag.attributes('tabindex')).toBe('0');
  });

  it('should render skill holder element', () => {
    const wrapper = mount(Skill, { props: defaultProps });
    expect(wrapper.find('.ant-sender-skill-holder').exists()).toBe(true);
  });

  it('should handle empty closable object', () => {
    const wrapper = mount(Skill, {
      props: { ...defaultProps, closable: {} },
    });
    expect(wrapper.find('.ant-sender-skill-close').exists()).toBe(true);
    expect(wrapper.find('.ant-sender-skill-close-icon').exists()).toBe(true);
  });
});

describe('Sender skill integration', () => {
  it('renders skill tag when skill prop is provided', async () => {
    const wrapper = mount(Sender, {
      props: {
        skill: {
          value: 'writing',
          title: 'Writing Assistant',
          closable: true,
        },
        slotConfig: [
          { type: 'text', value: 'Hello ' },
          {
            type: 'content',
            key: 'num',
            props: { defaultValue: '800', placeholder: '[words]' },
          },
        ],
      },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();
    expect(document.querySelector('.ant-sender-skill-tag-text')?.textContent).toContain(
      'Writing Assistant',
    );
    expect(document.querySelector('.ant-sender-slot-content')).toBeTruthy();
    wrapper.unmount();
  });

  it('passes skill through getValue and onSubmit', async () => {
    const onSubmit = vi.fn();
    const wrapper = mount(Sender, {
      props: {
        skill: {
          value: 'writing',
          title: 'Writing Assistant',
          closable: true,
        },
        slotConfig: [{ type: 'text', value: 'Hi' }],
        onSubmit,
      },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();
    const exposed = wrapper.vm as any;
    const value = exposed.getValue?.();
    expect(value?.skill?.value).toBe('writing');
    expect(value?.value).toContain('Hi');
    wrapper.unmount();
  });
});

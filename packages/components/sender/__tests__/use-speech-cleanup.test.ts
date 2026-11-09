import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';

const instances: MockRecognition[] = [];

class MockRecognition {
  onstart: (() => void) | null = null;

  onend: (() => void) | null = null;

  onresult: ((event: unknown) => void) | null = null;

  start = vi.fn();

  stop = vi.fn();

  constructor() {
    instances.push(this);
  }
}

describe('useSpeech cleanup', () => {
  beforeEach(() => {
    instances.length = 0;
    vi.resetModules();
    (window as any).SpeechRecognition = MockRecognition;
    (window as any).webkitSpeechRecognition = undefined;
  });

  afterEach(() => {
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
  });

  it('stops recognition and clears handlers on unmount', async () => {
    const { default: useSpeech } = await import('../useSpeech');
    let speech: ReturnType<typeof useSpeech> | undefined;

    const wrapper = mount(
      defineComponent({
        setup() {
          speech = useSpeech(() => {});
          return {};
        },
        template: '<div />',
      }),
    );

    speech!.triggerSpeech(false);
    expect(instances).toHaveLength(1);

    const recognition = instances[0];
    expect(recognition.start).toHaveBeenCalled();

    wrapper.unmount();

    expect(recognition.stop).toHaveBeenCalled();
    expect(recognition.onstart).toBeNull();
    expect(recognition.onend).toBeNull();
    expect(recognition.onresult).toBeNull();
  });
});

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Sources from '../index';

const items = [
  { key: '1', title: '1. Data source', url: 'https://example.com/1' },
  { key: '2', title: '2. Data source', url: 'https://example.com/2' },
];

describe('Sources inline mode', () => {
  it('pre-mounts carousel via forceRender (React parity)', async () => {
    const wrapper = mount(Sources, {
      props: {
        inline: true,
        title: 'Test',
        activeKey: '1',
        items,
      },
      attachTo: document.body,
    });

    await nextTick();
    await nextTick();

    expect(document.body.querySelector('.ant-sources-inline')).toBeTruthy();

    // forceRender should keep CarouselCard in the document without hover
    const carousel = document.body.querySelector('.ant-sources-carousel');
    expect(carousel).toBeTruthy();

    const itemTitles = document.body.querySelectorAll('.ant-sources-carousel-item-title');
    expect(itemTitles.length).toBe(2);
    expect(document.body.querySelector('.ant-sources-carousel-left-btn')).toBeTruthy();
    expect(document.body.querySelector('.ant-sources-carousel-right-btn')).toBeTruthy();
    expect(document.body.querySelector('.ant-sources-carousel-page')?.textContent).toBe('1/2');

    wrapper.unmount();
  });

  it('opens with native hover so overlay stays interactive', async () => {
    const wrapper = mount(Sources, {
      props: {
        inline: true,
        title: 'Test',
        activeKey: '1',
        items,
      },
      attachTo: document.body,
    });

    await nextTick();
    await nextTick();

    const titleWrapper = document.body.querySelector(
      '.ant-sources-title-wrapper',
    ) as HTMLElement;
    titleWrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await nextTick();
    await new Promise((r) => setTimeout(r, 150));
    await nextTick();

    const popover = document.body.querySelector('.ant-popover') as HTMLElement;
    expect(popover).toBeTruthy();
    expect(popover.style.display === 'none').toBe(false);

    // Move into overlay (native Trigger handoff)
    titleWrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    popover.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await nextTick();
    await new Promise((r) => setTimeout(r, 50));

    const rightBtn = document.body.querySelector(
      '.ant-sources-carousel-right-btn',
    ) as HTMLElement;
    rightBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    expect(document.body.querySelector('.ant-sources-carousel-page')?.textContent).toBe('2/2');

    wrapper.unmount();
  });
});

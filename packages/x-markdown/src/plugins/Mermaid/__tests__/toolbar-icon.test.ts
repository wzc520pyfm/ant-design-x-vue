import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Mermaid from '../Mermaid.vue';

const SOURCE = `graph TD
  Start --> Answer`;

describe('Mermaid toolbar icons', () => {
  it('renders action icons as svg instead of function source', async () => {
    const wrapper = mount(Mermaid, {
      props: { children: SOURCE },
    });
    await wrapper.vm.$nextTick();

    const header = wrapper.find('[class$="-mermaid-header"]');
    expect(header.exists()).toBe(true);
    const html = header.html();
    expect(html).not.toMatch(/\(\)\s*=>/);
    expect(header.findAll('svg').length).toBeGreaterThanOrEqual(4);
    wrapper.unmount();
  });
});

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Box from '../Box.vue';

const catalogUrl = 'https://catalog.example.com/catalog.json';
const commands = [
  {
    version: 'v0.9' as const,
    createSurface: { surfaceId: 's1', catalogId: catalogUrl },
  },
];

function mountBox(fetchMock: typeof fetch) {
  return mount(Box, {
    props: {
      commands,
      components: {},
      catalogOptions: { fetch: fetchMock },
    },
  });
}

describe('XCard catalog isolation', () => {
  it('fetches a remote catalog separately for each Box', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ components: { Text: { type: 'object' } } }),
          {
            status: 200,
            headers: { 'content-type': 'application/json' },
          },
        ),
    );

    const boxA = mountBox(fetchMock as unknown as typeof fetch);
    const boxB = mountBox(fetchMock as unknown as typeof fetch);

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    boxA.unmount();
    boxB.unmount();
  });
});

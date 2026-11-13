import { describe, expect, it, vi } from 'vitest';
import { setXRequestGlobalOptions } from '../../x-request';
import xFetch from '../../x-request/x-fetch';
import XMCPClient from '../index';

vi.mock('../../x-request/x-fetch', () => ({
  default: vi.fn(),
}));

const mockedXFetch = xFetch as unknown as ReturnType<typeof vi.fn>;

describe('XMCPClient global manual option', () => {
  it('starts its internal request when global manual is true', async () => {
    setXRequestGlobalOptions({ manual: true });

    const tools = [
      {
        name: 'TestTool',
        description: 'A test tool',
        inputSchema: { type: 'object', properties: {} },
      },
    ];
    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json; charset=utf-8' },
      json: vi.fn().mockResolvedValueOnce(tools),
    });

    const client = XMCPClient('https://api.example.com/mcp', { params: {} });

    await expect(client.tools()).resolves.toEqual(tools);
    expect(mockedXFetch).toHaveBeenCalledTimes(1);
  });
});

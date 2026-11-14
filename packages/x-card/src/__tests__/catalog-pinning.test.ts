import { describe, expect, it, vi } from 'vitest';
import { createPinnedRequestOptions } from '../catalog';

describe('createPinnedRequestOptions', () => {
  it('pins the validated address while preserving hostname and SNI', () => {
    const options = createPinnedRequestOptions(
      new URL('https://catalog.example.com/catalog.json'),
      '93.184.216.34',
      4,
    );

    expect(typeof options.lookup).toBe('function');
    const callback = vi.fn();
    (options.lookup as any)('catalog.example.com', {}, callback);
    expect(callback).toHaveBeenCalledWith(null, '93.184.216.34', 4);
    expect(options.servername).toBe('catalog.example.com');
    expect(options.headers).toMatchObject({
      accept: 'application/json',
      'accept-encoding': 'identity',
    });
  });

  it('returns address records when lookup is called with all: true', () => {
    const options = createPinnedRequestOptions(
      new URL('https://catalog.example.com/catalog.json'),
      '93.184.216.34',
      4,
    );

    const callback = vi.fn();
    (options.lookup as any)('catalog.example.com', { all: true }, callback);
    expect(callback).toHaveBeenCalledWith(null, [
      { address: '93.184.216.34', family: 4 },
    ]);
  });

  it('does not set SNI for an IP literal', () => {
    const options = createPinnedRequestOptions(
      new URL('https://93.184.216.34/catalog.json'),
      '93.184.216.34',
      4,
    );

    expect(options.servername).toBeUndefined();
  });

  it('omits lookup when no address is pinned', () => {
    const options = createPinnedRequestOptions(
      new URL('http://localhost:8080/catalog.json'),
    );

    expect(options.lookup).toBeUndefined();
    expect(options.servername).toBeUndefined();
  });
});

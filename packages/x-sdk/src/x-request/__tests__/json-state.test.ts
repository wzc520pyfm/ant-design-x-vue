import { describe, expect, it, vi } from 'vitest';
import XRequest from '../index';

const baseURL = 'https://api.example.com/v1/chat';
const errorResponse = {
  success: false,
  name: 'ValidationError',
  message: 'Invalid input parameters',
};

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('XRequest JSON failure state', () => {
  it.each([true, false])('finishes a business failure with callbacks=%s', async (withCallbacks) => {
    const callbackStates: boolean[] = [];
    const onError = vi.fn(() => {
      callbackStates.push(request.isRequesting);
    });
    const onSuccess = vi.fn();
    const onUpdate = vi.fn();
    const response = jsonResponse(errorResponse);
    const fetch = vi.fn().mockResolvedValue(response);
    const request = XRequest(baseURL, {
      manual: true,
      fetch,
      callbacks: withCallbacks ? { onError, onSuccess, onUpdate } : undefined,
    });

    request.run();
    expect(request.isRequesting).toBe(true);
    await request.asyncHandler;

    expect(request.isRequesting).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onUpdate).not.toHaveBeenCalled();
    expect(callbackStates).toEqual(withCallbacks ? [false] : []);
    if (withCallbacks) {
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ name: errorResponse.name, message: errorResponse.message }),
        errorResponse,
        response.headers,
      );
    }
  });

  it('ignores an older JSON failure that resolves after a newer request starts', async () => {
    let resolveOlderBody!: (body: unknown) => void;
    let resolveNewerResponse!: (response: Response) => void;
    let notifyBodyStarted!: () => void;
    const olderResponse = jsonResponse(errorResponse);
    const pendingOlderBody = new Promise((resolve) => {
      resolveOlderBody = resolve;
    });
    const pendingNewerResponse = new Promise<Response>((resolve) => {
      resolveNewerResponse = resolve;
    });
    const bodyStarted = new Promise<void>((resolve) => {
      notifyBodyStarted = resolve;
    });
    vi.spyOn(olderResponse, 'json').mockImplementation(() => {
      notifyBodyStarted();
      return pendingOlderBody;
    });

    const callbackStates: boolean[] = [];
    const onError = vi.fn(() => {
      callbackStates.push(request.isRequesting);
    });
    const onSuccess = vi.fn();
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(olderResponse)
      .mockReturnValueOnce(pendingNewerResponse);
    const request = XRequest(baseURL, {
      manual: true,
      fetch,
      callbacks: { onError, onSuccess },
    });

    request.run();
    const olderRequest = request.asyncHandler;
    await bodyStarted;
    request.run();
    const newerRequest = request.asyncHandler;
    expect(request.isRequesting).toBe(true);

    resolveOlderBody(errorResponse);
    await olderRequest;

    expect(request.asyncHandler).toBe(newerRequest);
    expect(request.isRequesting).toBe(true);
    // The superseded request must not surface its late error to the app.
    expect(callbackStates).toEqual([]);

    resolveNewerResponse(jsonResponse({ success: true }));
    await newerRequest;
    expect(request.isRequesting).toBe(false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

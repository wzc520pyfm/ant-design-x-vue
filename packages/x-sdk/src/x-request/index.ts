export interface XRequestOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface XRequestCallbacks<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onUpdate?: (chunk: string) => void;
}

export type XRequestFunction<T = any> = (
  url: string,
  options?: RequestInit
) => Promise<T>;

export interface XRequestInstance {
  request: <T = any>(url: string, options?: RequestInit) => Promise<T>;
  stream: (
    url: string,
    options?: RequestInit,
    callbacks?: XRequestCallbacks
  ) => Promise<void>;
}

/**
 * XRequest - HTTP request utility with streaming support
 * TODO: Implement full functionality
 */
export function XRequest(options: XRequestOptions = {}): XRequestInstance {
  const { baseURL = '', headers = {}, timeout } = options;

  const request = async <T = any>(
    url: string,
    requestOptions?: RequestInit
  ): Promise<T> => {
    const fullUrl = baseURL ? `${baseURL}${url}` : url;
    
    const response = await fetch(fullUrl, {
      ...requestOptions,
      headers: {
        ...headers,
        ...requestOptions?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const stream = async (
    url: string,
    requestOptions?: RequestInit,
    callbacks?: XRequestCallbacks
  ): Promise<void> => {
    // TODO: Implement streaming
    throw new Error('Not implemented');
  };

  return {
    request,
    stream,
  };
}

export default XRequest;

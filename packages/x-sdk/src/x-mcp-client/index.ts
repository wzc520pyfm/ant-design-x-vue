import type { AnyObject } from '../_util/type';
import XRequest, { type XRequestOptions } from '../x-request';

export interface XMCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: 'object';
    properties: AnyObject;
  };
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
}

export type XMCPClientOptions = Pick<
  XRequestOptions,
  'params' | 'headers' | 'timeout' | 'fetch'
>;

/**
 * MCP (Model Context Protocol) client that talks to a server exposing an
 * MCP-compatible HTTP endpoint, built on top of `XRequest` so that it reuses
 * the shared middleware, timeouts and abort semantics.
 */
export class XMCPClientClass {
  readonly baseURL: string;
  private options: XMCPClientOptions | undefined;

  constructor(baseURL: string, options?: XMCPClientOptions) {
    if (!baseURL || typeof baseURL !== 'string') {
      throw new Error('The baseURL is not valid!');
    }
    this.baseURL = baseURL;
    this.options = options;
  }

  /**
   * Fetch the list of tools published by the MCP server.
   */
  async tools(): Promise<XMCPTool[]> {
    return new Promise((resolve, reject) => {
      XRequest(this.baseURL, {
        ...(this.options || {}),
        callbacks: {
          onSuccess(chunks) {
            resolve((chunks?.[0] as XMCPTool[]) || []);
          },
          onError(error: Error) {
            reject(error);
          },
        },
      });
    });
  }
}

export function XMCPClient(baseURL: string, options?: XMCPClientOptions) {
  return new XMCPClientClass(baseURL, options);
}

// Backwards-compatible aliases – early Vue releases exposed `XMcpClient` with a
// different signature. Keep both so existing imports keep working.
export const XMcpClient = XMCPClient;
export type XMcpClientOptions = XMCPClientOptions;

export default XMCPClient;

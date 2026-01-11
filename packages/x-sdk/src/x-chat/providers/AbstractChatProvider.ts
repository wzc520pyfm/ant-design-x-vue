import type { XModelParams, XModelResponse } from './types/model';

/**
 * Abstract base class for chat providers
 * TODO: Implement full functionality
 */
export abstract class AbstractChatProvider {
  protected apiKey?: string;
  protected baseUrl?: string;

  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl;
  }

  abstract chat(params: XModelParams): Promise<XModelResponse>;

  abstract chatStream(
    params: XModelParams
  ): AsyncGenerator<string, void, unknown>;
}

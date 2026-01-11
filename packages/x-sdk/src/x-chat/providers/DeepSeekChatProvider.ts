import { AbstractChatProvider } from './AbstractChatProvider';
import type { XModelParams, XModelResponse } from './types/model';

/**
 * DeepSeek chat provider
 * TODO: Implement full functionality
 */
export class DeepSeekChatProvider extends AbstractChatProvider {
  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    super({
      ...options,
      baseUrl: options.baseUrl || 'https://api.deepseek.com/v1',
    });
  }

  async chat(params: XModelParams): Promise<XModelResponse> {
    // TODO: Implement
    throw new Error('Not implemented');
  }

  async *chatStream(
    params: XModelParams
  ): AsyncGenerator<string, void, unknown> {
    // TODO: Implement
    throw new Error('Not implemented');
  }
}

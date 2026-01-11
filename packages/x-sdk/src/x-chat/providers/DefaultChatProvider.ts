import { AbstractChatProvider } from './AbstractChatProvider';
import type { XModelParams, XModelResponse } from './types/model';

/**
 * Default chat provider implementation
 * TODO: Implement full functionality
 */
export class DefaultChatProvider extends AbstractChatProvider {
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

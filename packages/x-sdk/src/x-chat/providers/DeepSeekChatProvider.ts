import type { XModelMessage, XModelParams } from './types/model';
import type { XRequestOptions } from '../../x-request';
import type { SSEFields } from '../../x-stream';
import AbstractChatProvider, { type TransformMessage } from './AbstractChatProvider';

/**
 * DeepSeek Chat Provider
 */
export default class DeepSeekChatProvider<
  ChatMessage extends XModelMessage = XModelMessage,
  Input extends XModelParams = XModelParams,
  Output extends Partial<Record<SSEFields, any>> = Partial<Record<SSEFields, any>>,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  transformParams(requestParams: Partial<Input>, options: XRequestOptions<Input, Output>): Input {
    return {
      ...(options?.params || {}),
      ...requestParams,
      messages: this.getMessages(),
    } as unknown as Input;
  }

  transformLocalMessage(requestParams: Partial<Input>): ChatMessage[] {
    return (requestParams?.messages || []) as ChatMessage[];
  }

  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { originMessage, chunk, chunks, responseHeaders } = info;
    let currentContent = '';
    let currentThink = '';
    let role = 'assistant';
    try {
      let message: any;
      if (responseHeaders.get('content-type')?.includes('text/event-stream')) {
        if (chunk && (chunk as any).data?.trim() !== '[DONE]') {
          message = JSON.parse((chunk as any).data);
        }
      } else {
        message = chunk || chunks[0];
      }
      if (message) {
        message?.choices?.forEach((choice: any) => {
          if (choice?.delta) {
            currentThink = choice.delta.reasoning_content || '';
            currentContent += choice.delta.content || '';
            role = choice.delta.role;
          } else if (choice?.message) {
            currentThink = choice.message.reasoning_content || '';
            currentContent += choice.message.content || '';
            role = choice.message.role;
          }
        });
      }
    } catch (error) {
      console.error('transformMessage error', error);
    }
    let content = '';
    const originCtx: any = originMessage;
    let originMessageContent =
      typeof originCtx?.content === 'string' ? originCtx?.content : originCtx?.content?.text || '';
    if (!originMessageContent && currentThink) {
      content = `<think>${currentThink}`;
    } else if (
      originMessageContent.includes('<think>') &&
      !originMessageContent.includes('</think>') &&
      currentContent
    ) {
      originMessageContent = originMessageContent.replace('<think>', '<think status="done">');
      content = `${originMessageContent}</think>${currentContent}`;
    } else {
      content = `${originMessageContent || ''}${currentThink}${currentContent}`;
    }

    return {
      content,
      role: role || 'assistant',
    } as ChatMessage;
  }
}

export { DeepSeekChatProvider };

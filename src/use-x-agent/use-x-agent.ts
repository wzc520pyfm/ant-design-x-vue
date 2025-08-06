import XRequest from '../x-request';
import type { SSEOutput, XStreamOptions } from '../x-stream';

import type { AnyObject } from '../_util/type';
import { computed, ref, type MaybeRefOrGetter, toValue } from 'vue';

interface RequestFnInfo<Message> extends AnyObject {
  messages?: Message[];
  message?: Message;
}

export type RequestFn<Message, Input, Output> = (
  info: Input,
  callbacks: {
    onUpdate: (chunk: Output) => void;
    onSuccess: (chunk: Output[]) => void;
    onError: (error: Error) => void;
    onStream?: (abortController: AbortController) => void;
  },
  transformStream?: XStreamOptions<Message>['transformStream'],
) => void;

export interface XAgentConfigPreset {
  baseURL: string;
  key: string;
  model: string;
  dangerouslyApiKey: string;
}
export interface XAgentConfigCustom<Message, Input, Output> {
  request?: RequestFn<Message, Input, Output>;
}

export type XAgentConfig<Message, Input, Output> = Partial<XAgentConfigPreset> &
  XAgentConfigCustom<Message, Input, Output>;

let uuid = 0;

/** This is a wrap class to avoid developer can get too much on origin object */
export class XAgent<Message = string, Input = RequestFnInfo<Message>, Output = SSEOutput> {
  config: XAgentConfig<Message, Input, Output>;

  private requestingMap = ref<Record<number, boolean>>({});

  constructor(config: XAgentConfig<Message, Input, Output>) {
    this.config = config;
  }

  private finishRequest(id: number) {
    delete this.requestingMap.value[id];
  }

  public request: RequestFn<Message, Input, Output> = (info, callbacks, transformStream?) => {
    const { request } = this.config;
    const { onUpdate, onSuccess, onError, onStream } = callbacks;

    const id = uuid;
    uuid += 1;
    this.requestingMap.value[id] = true;

    request?.(info, {
      onStream: (abortController) => {
        if (this.requestingMap.value[id]) {
          onStream?.(abortController);
        }
      },
      // Status should be unique.
      // One get success or error should not get more message
      onUpdate: (chunk) => {
        if (this.requestingMap.value[id]) {
          onUpdate(chunk);
        }
      },
      onSuccess: (chunk) => {
        if (this.requestingMap.value[id]) {
          onSuccess(chunk);
          this.finishRequest(id);
        }
      },
      onError: (error) => {
        if (this.requestingMap.value[id]) {
          onError(error);
          this.finishRequest(id);
        }
      },
    },
      transformStream);
  };

  public isRequesting() {
    return Object.keys(this.requestingMap.value).length > 0;
  }
}

export default function useXAgent<
  Message = string,
  Input = RequestFnInfo<Message>,
  Output = SSEOutput,
>(config: MaybeRefOrGetter<XAgentConfig<Message, Input, Output>>) {
  const agent = computed(
    () => {
      const { request, ...restConfig } = toValue(config);
      return new XAgent<Message, Input, Output>({
        // @ts-expect-error
        request:
          request! ||
          XRequest({
            baseURL: restConfig.baseURL!,
            model: restConfig.model,
            dangerouslyApiKey: restConfig.dangerouslyApiKey,
          }).value.create,
        ...restConfig,
      });
    });

  return [
    agent
  ]
}

import XRequest from '../x-request';
import { XStreamOptions } from '../x-stream';

import type { AnyObject } from '../_util/type';
import { computed, ref } from 'vue';

interface RequestFnInfo<Message> extends Partial<XAgentConfigPreset>, AnyObject {
  messages?: Message[];
  message?: Message;
}

export type RequestFn<Message> = (
  info: RequestFnInfo<Message>,
  callbacks: {
    onUpdate: (message: Message) => void;
    onSuccess: (message: Message) => void;
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
export interface XAgentConfigCustom<Message> {
  request?: RequestFn<Message>;
}

export type XAgentConfig<Message> = Partial<XAgentConfigPreset> & XAgentConfigCustom<Message>;

let uuid = 0;

/** This is a wrap class to avoid developer can get too much on origin object */
export class XAgent<Message = string> {
  config: XAgentConfig<Message>;

  private requestingMap = ref<Record<number, boolean>>({});

  constructor(config: XAgentConfig<Message>) {
    this.config = config;
  }

  private finishRequest(id: number) {
    delete this.requestingMap.value[id];
  }

  public request: RequestFn<Message> = (info, callbacks, transformStream?) => {
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
      onUpdate: (message) => {
        if (this.requestingMap.value[id]) {
          onUpdate(message);
        }
      },
      onSuccess: (message) => {
        if (this.requestingMap.value[id]) {
          onSuccess(message);
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

export default function useXAgent<Message = string>(config: XAgentConfig<Message>) {
  const { request, ...restConfig } = config;
  const agent = computed(
    () =>
      new XAgent<Message>({
        // @ts-expect-error
        request:
          request! ||
          XRequest({
            baseURL: restConfig.baseURL!,
            model: restConfig.model,
            dangerouslyApiKey: restConfig.dangerouslyApiKey,
          }).create,
        ...restConfig,
      }));

  return [
    agent
  ]
}

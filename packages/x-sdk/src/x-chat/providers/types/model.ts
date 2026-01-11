export interface XModelMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface XModelParams {
  model: string;
  messages: XModelMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  [key: string]: any;
}

export interface XModelResponse {
  id: string;
  choices: {
    index: number;
    message: XModelMessage;
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

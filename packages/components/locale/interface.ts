import type { Locale as AntdLocale } from 'ant-design-vue/es/locale';

export interface xLocale {
  locale: string;
  Conversations?: {
    create: string;
  };
  Actions?: {
    feedbackLike: string;
    feedbackDislike: string;
    audio: string;
    audioRunning: string;
    audioError: string;
    audioLoading: string;
  };
  Sender?: {
    stopLoading: string;
    speechRecording: string;
  };
  Bubble?: {
    editableOk: string;
    editableCancel: string;
  };
}

export interface xMarkdownLocale {
  Mermaid?: {
    copySuccess: string;
    copy: string;
    zoomIn: string;
    zoomOut: string;
    zoomReset: string;
    download: string;
    code: string;
    image: string;
  };
  HighlightCode?: {
    copySuccess: string;
    copy: string;
  };
}

export type Locale = xLocale & AntdLocale & xMarkdownLocale;

export type LocaleContextProps = Locale & { exist?: boolean };

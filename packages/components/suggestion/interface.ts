import type { CSSProperties, VNode } from "vue";

export type SuggestionItem = {
  label: VNode | string;
  value: string;

  icon?: VNode;

  children?: SuggestionItem[];

  extra?: VNode | string;
};

export interface RenderChildrenProps<T> {
  onTrigger: (info?: T | false) => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

export interface SuggestionProps<T = any> {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
  children?: (props: RenderChildrenProps<T>) => VNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: SuggestionItem[] | ((info?: T) => SuggestionItem[]);
  onSelect?: (value: string) => void;
  block?: boolean;
  styles?: Partial<Record<string, CSSProperties>>;
  classNames?: Partial<Record<string, string>>;
}

export type AnyObject = Record<PropertyKey, any>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

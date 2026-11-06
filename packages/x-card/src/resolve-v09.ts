import { setValueByPath } from './utils';

export function applyDataModelUpdateV09(
  prevDataModel: Record<string, any>,
  path: string,
  value: any,
): Record<string, any> {
  return setValueByPath(prevDataModel, path, value);
}

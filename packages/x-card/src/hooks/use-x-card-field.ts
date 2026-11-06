import { computed, ref } from 'vue';

export interface XCardFieldRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp | string;
  message?: string;
  validator?: (value: unknown) => string | undefined;
}

/** Validate a single field value against sequential rules; returns the first error message. */
export function validateFieldValue(value: unknown, rules: XCardFieldRule[] = []): string | undefined {
  for (const rule of rules) {
    if (rule.required && (value === undefined || value === null || String(value).trim() === '')) {
      return rule.message || 'This field is required';
    }
    if (typeof value === 'string') {
      if (rule.minLength != null && value.length < rule.minLength) {
        return rule.message || `Must be at least ${rule.minLength} characters`;
      }
      if (rule.maxLength != null && value.length > rule.maxLength) {
        return rule.message || `Must be at most ${rule.maxLength} characters`;
      }
      if (rule.pattern) {
        const re = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern;
        if (!re.test(value)) {
          return rule.message || 'Invalid format';
        }
      }
    }
    if (rule.validator) {
      const result = rule.validator(value);
      if (result) return result;
    }
  }
  return undefined;
}

/**
 * Lightweight form-field helper for custom A2UI components.
 * Writes back through Card-injected `onDataChange(path, value)` after each set.
 */
export function useXCardField(options: {
  path: string;
  onDataChange?: (path: string, value: unknown) => void;
  rules?: XCardFieldRule[];
  initialValue?: unknown;
}) {
  const value = ref(options.initialValue ?? '');
  const error = ref<string | undefined>();

  const setValue = (next: unknown) => {
    value.value = next as any;
    error.value = validateFieldValue(next, options.rules);
    options.onDataChange?.(options.path, next);
  };

  const validate = () => {
    error.value = validateFieldValue(value.value, options.rules);
    return !error.value;
  };

  return {
    value,
    error,
    setValue,
    validate,
    valid: computed(() => !error.value),
  };
}

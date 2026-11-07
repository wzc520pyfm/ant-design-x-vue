import { describe, expect, it, vi } from 'vitest';
import { validateFieldValue, useXCardField } from '../hooks/use-x-card-field';

describe('validateFieldValue', () => {
  it('checks required / minLength / pattern / custom validator', () => {
    expect(validateFieldValue('', [{ required: true, message: 'need it' }])).toBe('need it');
    expect(validateFieldValue('ab', [{ minLength: 3 }])).toBe('Must be at least 3 characters');
    expect(validateFieldValue('nope', [{ pattern: /^[a-z]+@x$/, message: 'bad' }])).toBe('bad');
    expect(validateFieldValue('ok', [{ validator: (v) => (v === 'ok' ? undefined : 'nope') }])).toBeUndefined();
    expect(validateFieldValue('toolong', [{ maxLength: 3, message: 'short' }])).toBe('short');
  });
});

describe('useXCardField', () => {
  it('writes through onDataChange and records errors', () => {
    const onDataChange = vi.fn();
    const field = useXCardField({
      path: '/form/email',
      onDataChange,
      rules: [{ required: true }, { pattern: /.+@.+\..+/, message: 'email' }],
    });
    field.setValue('');
    expect(field.error.value).toBe('This field is required');
    expect(onDataChange).toHaveBeenCalledWith('/form/email', '');
    field.setValue('ada@example.com');
    expect(field.error.value).toBeUndefined();
    expect(field.validate()).toBe(true);
    field.setValue('not-an-email');
    expect(field.error.value).toBe('email');
    expect(field.validate()).toBe(false);
  });
});

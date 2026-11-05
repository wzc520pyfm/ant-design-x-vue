import { unit } from '../../cssinjs';

function genMaxMin(type: 'css' | 'js') {
  if (type === 'js') {
    return { max: Math.max, min: Math.min };
  }
  return {
    max: (...args: (string | number)[]) => `max(${args.map((value) => unit(value)).join(',')})`,
    min: (...args: (string | number)[]) => `min(${args.map((value) => unit(value)).join(',')})`,
  };
}

export default genMaxMin;

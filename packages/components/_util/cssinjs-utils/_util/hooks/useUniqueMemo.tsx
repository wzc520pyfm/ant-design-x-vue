import { computed } from "vue";

const BEAT_LIMIT = 1000 * 60 * 10;

/**
 * A helper class to map keys to values.
 * It supports both primitive keys and object keys.
 */
class ArrayKeyMap<T> {
  map = new Map<string, T>();

  // Use WeakMap to avoid memory leak
  objectIDMap = new WeakMap<object, number>();

  nextID = 0;

  lastAccessBeat = new Map<string, number>();

  // We will clean up the cache when reach the limit
  accessBeat = 0;

  set(keys: unknown[], value: any) {
    // New set will trigger clear
    this.clear();

    // Set logic
    const compositeKey = this.getCompositeKey(keys);
    this.map.set(compositeKey, value);
    this.lastAccessBeat.set(compositeKey, Date.now());
  }

  get(keys: unknown[]) {
    const compositeKey = this.getCompositeKey(keys);

    const cache = this.map.get(compositeKey);
    this.lastAccessBeat.set(compositeKey, Date.now());
    this.accessBeat += 1;

    return cache;
  }

  getCompositeKey(keys: unknown[]) {
    const ids = keys.map<string>((key) => {
      if (key && typeof key === 'object') {
        return `obj_${this.getObjectID(key)}`;
      }
      return `${typeof key}_${key}`;
    });
    return ids.join('|');
  }

  getObjectID(obj: object) {
    if (this.objectIDMap.has(obj)) {
      return this.objectIDMap.get(obj);
    }
    const id = this.nextID;
    this.objectIDMap.set(obj, id);

    this.nextID += 1;

    return id;
  }

  clear() {
    if (this.accessBeat > 10000) {
      const now = Date.now();

      this.lastAccessBeat.forEach((beat, key) => {
        if (now - beat > BEAT_LIMIT) {
          this.map.delete(key);
          this.lastAccessBeat.delete(key);
        }
      });

      this.accessBeat = 0;
    }
  }
}

const uniqueMap = new ArrayKeyMap();

/**
 * Like `useMemo`, but this hook result will be shared across all instances.
 */
function useUniqueMemo<T>(memoFn: () => T, deps: unknown[]) {
  return computed(() => {
    const cachedValue = uniqueMap.get(deps);
    if (cachedValue) {
      return cachedValue as T;
    }
    const newValue = memoFn();
    uniqueMap.set(deps, newValue);
    return newValue;
  });
}

export default useUniqueMemo;

/**
 * 内置工具函数库
 * @description 提供数据筛选、统计、转换等常用功能，API 与 lodash/Ramda 兼容
 */

export const BUILTIN_UTILS_SOURCE = `
// ============================================
// 内置工具库 - 与 lodash/Ramda 兼容
// ============================================

const _ = {
  // ========== 数组操作 ==========
  
  map: (array, iteratee) => {
    if (!Array.isArray(array)) return [];
    return array.map(typeof iteratee === 'function' 
      ? iteratee 
      : item => item?.[iteratee]);
  },
  
  filter: (array, predicate) => {
    if (!Array.isArray(array)) return [];
    if (typeof predicate === 'function') return array.filter(predicate);
    if (typeof predicate === 'object') {
      return array.filter(item => 
        Object.entries(predicate).every(([key, val]) => item?.[key] === val)
      );
    }
    return array.filter(item => item?.[predicate]);
  },
  
  find: (array, predicate) => {
    if (!Array.isArray(array)) return undefined;
    if (typeof predicate === 'function') return array.find(predicate);
    if (typeof predicate === 'object') {
      return array.find(item => 
        Object.entries(predicate).every(([key, val]) => item?.[key] === val)
      );
    }
    return array.find(item => item?.[predicate]);
  },
  
  some: (array, predicate) => {
    if (!Array.isArray(array)) return false;
    if (typeof predicate === 'function') return array.some(predicate);
    return array.some(item => item?.[predicate]);
  },
  
  every: (array, predicate) => {
    if (!Array.isArray(array)) return true;
    if (typeof predicate === 'function') return array.every(predicate);
    return array.every(item => item?.[predicate]);
  },
  
  reduce: (array, iteratee, accumulator) => {
    if (!Array.isArray(array)) return accumulator;
    return accumulator !== undefined 
      ? array.reduce(iteratee, accumulator)
      : array.reduce(iteratee);
  },
  
  groupBy: (array, iteratee) => {
    if (!Array.isArray(array)) return {};
    const fn = typeof iteratee === 'function' ? iteratee : item => item?.[iteratee];
    return array.reduce((result, item) => {
      const key = fn(item);
      (result[key] = result[key] || []).push(item);
      return result;
    }, {});
  },
  
  sortBy: (array, iteratees) => {
    if (!Array.isArray(array)) return [];
    const arr = [...array];
    const fns = Array.isArray(iteratees) ? iteratees : [iteratees];
    return arr.sort((a, b) => {
      for (const fn of fns) {
        const getVal = typeof fn === 'function' ? fn : item => item?.[fn];
        const valA = getVal(a);
        const valB = getVal(b);
        if (valA < valB) return -1;
        if (valA > valB) return 1;
      }
      return 0;
    });
  },
  
  uniq: (array) => {
    if (!Array.isArray(array)) return [];
    return [...new Set(array)];
  },
  
  uniqBy: (array, iteratee) => {
    if (!Array.isArray(array)) return [];
    const seen = new Set();
    const fn = typeof iteratee === 'function' ? iteratee : item => item?.[iteratee];
    return array.filter(item => {
      const key = fn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },
  
  flatten: (array) => {
    if (!Array.isArray(array)) return [];
    return array.flat();
  },
  
  flattenDeep: (array) => {
    if (!Array.isArray(array)) return [];
    return array.flat(Infinity);
  },
  
  chunk: (array, size = 1) => {
    if (!Array.isArray(array) || size < 1) return [];
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  },
  
  take: (array, n = 1) => {
    if (!Array.isArray(array)) return [];
    return array.slice(0, n);
  },
  
  drop: (array, n = 1) => {
    if (!Array.isArray(array)) return [];
    return array.slice(n);
  },
  
  compact: (array) => {
    if (!Array.isArray(array)) return [];
    return array.filter(Boolean);
  },
  
  // ========== 对象操作 ==========
  
  keys: (obj) => {
    if (!obj || typeof obj !== 'object') return [];
    return Object.keys(obj);
  },
  
  values: (obj) => {
    if (!obj || typeof obj !== 'object') return [];
    return Object.values(obj);
  },
  
  entries: (obj) => {
    if (!obj || typeof obj !== 'object') return [];
    return Object.entries(obj);
  },
  
  pick: (obj, keys) => {
    if (!obj || typeof obj !== 'object') return {};
    const picked = {};
    const keyArray = Array.isArray(keys) ? keys : [keys];
    keyArray.forEach(key => {
      if (key in obj) picked[key] = obj[key];
    });
    return picked;
  },
  
  omit: (obj, keys) => {
    if (!obj || typeof obj !== 'object') return {};
    const result = { ...obj };
    const keyArray = Array.isArray(keys) ? keys : [keys];
    keyArray.forEach(key => delete result[key]);
    return result;
  },
  
  mapValues: (obj, iteratee) => {
    if (!obj || typeof obj !== 'object') return {};
    const result = {};
    const fn = typeof iteratee === 'function' ? iteratee : () => iteratee;
    Object.entries(obj).forEach(([key, value]) => {
      result[key] = fn(value, key, obj);
    });
    return result;
  },
  
  get: (obj, path, defaultValue) => {
    if (!obj) return defaultValue;
    const keys = Array.isArray(path) ? path : path.split('.');
    let result = obj;
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) return defaultValue;
    }
    return result;
  },
  
  // ========== 数据判断 ==========
  
  isArray: (value) => Array.isArray(value),
  
  isObject: (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },
  
  isString: (value) => typeof value === 'string',
  
  isNumber: (value) => typeof value === 'number' && !isNaN(value),
  
  isBoolean: (value) => typeof value === 'boolean',
  
  isFunction: (value) => typeof value === 'function',
  
  isNil: (value) => value === null || value === undefined,
  
  isEmpty: (value) => {
    if (value == null) return true;
    if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },
  
  // ========== 数学统计 ==========
  
  sum: (array) => {
    if (!Array.isArray(array)) return 0;
    return array.reduce((sum, n) => sum + (Number(n) || 0), 0);
  },
  
  sumBy: (array, iteratee) => {
    if (!Array.isArray(array)) return 0;
    const fn = typeof iteratee === 'function' ? iteratee : item => item?.[iteratee];
    return array.reduce((sum, item) => sum + (Number(fn(item)) || 0), 0);
  },
  
  mean: (array) => {
    if (!Array.isArray(array) || array.length === 0) return 0;
    return _.sum(array) / array.length;
  },
  
  meanBy: (array, iteratee) => {
    if (!Array.isArray(array) || array.length === 0) return 0;
    return _.sumBy(array, iteratee) / array.length;
  },
  
  max: (array) => {
    if (!Array.isArray(array) || array.length === 0) return undefined;
    return Math.max(...array.map(Number).filter(n => !isNaN(n)));
  },
  
  maxBy: (array, iteratee) => {
    if (!Array.isArray(array) || array.length === 0) return undefined;
    const fn = typeof iteratee === 'function' ? iteratee : item => item?.[iteratee];
    return array.reduce((max, item) => {
      const val = fn(item);
      return max === undefined || val > fn(max) ? item : max;
    }, undefined);
  },
  
  min: (array) => {
    if (!Array.isArray(array) || array.length === 0) return undefined;
    return Math.min(...array.map(Number).filter(n => !isNaN(n)));
  },
  
  minBy: (array, iteratee) => {
    if (!Array.isArray(array) || array.length === 0) return undefined;
    const fn = typeof iteratee === 'function' ? iteratee : item => item?.[iteratee];
    return array.reduce((min, item) => {
      const val = fn(item);
      return min === undefined || val < fn(min) ? item : min;
    }, undefined);
  },
  
  count: (array) => {
    if (!Array.isArray(array)) return 0;
    return array.length;
  },
  
  countBy: (array, iteratee) => {
    if (!Array.isArray(array)) return {};
    const fn = typeof iteratee === 'function' ? iteratee : item => item?.[iteratee];
    return array.reduce((result, item) => {
      const key = fn(item);
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});
  },
  
  // ========== 其他工具 ==========
  
  cloneDeep: (value) => {
    if (value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(_.cloneDeep);
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, _.cloneDeep(v)])
    );
  },
  
  merge: (...objects) => {
    return Object.assign({}, ...objects);
  },
  
  debounce: (func, wait = 0) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
  
  throttle: (func, wait = 0) => {
    let lastTime = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        return func.apply(this, args);
      }
    };
  },
  
  range: (start, end, step = 1) => {
    if (end === undefined) {
      end = start;
      start = 0;
    }
    const result = [];
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
    return result;
  },
};

// 同时暴露为 R (Ramda 风格)
const R = _;

// 暴露到全局
self._ = _;
self.R = R;
`.trim()

export const HAS_BUILTIN_UTILS = BUILTIN_UTILS_SOURCE.length > 100

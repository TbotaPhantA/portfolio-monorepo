import * as _ from 'lodash';

export function deepOmitPrivate<T extends Record<string, any>>(o: T | T[]) {
  if (Array.isArray(o)) {
    return o.map(deepOmitPrivate);
  } else if (o !== null && typeof o === 'object') {
    const noPriv = _.omitBy(o, (_v: any, k: string) => k.startsWith('#'));
    return _.mapValues(noPriv, deepOmitPrivate);
  }
  return o;
}

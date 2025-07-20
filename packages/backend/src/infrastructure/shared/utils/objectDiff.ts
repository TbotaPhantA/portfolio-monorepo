import * as _ from 'lodash';

export function objectDiff(
  current: Record<string, any>,
  original: Record<string, any>,
): Record<string, any> {
  return _.transform(
    current,
    (result: Record<string, any>, value: any, key: string) => {
      // skip functions entirely
      if (_.isFunction(value)) return;

      const baseValue = original[key];
      if (!_.isEqual(value, baseValue)) {
        if (_.isPlainObject(value) && _.isPlainObject(baseValue)) {
          const nested = objectDiff(value, baseValue);
          if (!_.isEmpty(nested)) {
            result[key] = nested;
          }
        } else {
          result[key] = value;
        }
      }
    },
    {} as Record<string, any>,
  );
}

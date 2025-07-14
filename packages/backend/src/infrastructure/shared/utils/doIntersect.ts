export const doIntersect = <T>(arr1: Array<T>, arr2: Array<T>): boolean => arr1.some(item => arr2.includes(item))

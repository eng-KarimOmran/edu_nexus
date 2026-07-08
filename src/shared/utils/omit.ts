import { omit as omitLodash } from "lodash-es";

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const uniqueKeys = Array.from(new Set(keys));
  return omitLodash(obj, uniqueKeys as string[]) as Omit<T, K>;
};

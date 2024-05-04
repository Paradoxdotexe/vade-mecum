import { get } from 'lodash-es';

export const searchObjects = <T extends object>(
  objects: T[],
  objectKeys: string[],
  query: string
) => {
  const regex = new RegExp(query, 'i');
  return objects.filter(object =>
    objectKeys.map(key => get(object, key)).some(property => regex.test(property as string))
  );
};

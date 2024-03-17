export const searchObjects = <T extends object>(
  objects: T[],
  objectKeys: (keyof T)[],
  query: string
) => {
  const regex = new RegExp(query, 'i');
  return objects.filter(object =>
    objectKeys.map(key => object[key]).some(property => regex.test(property as string))
  );
};

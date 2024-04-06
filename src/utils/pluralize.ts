export const pluralize = (str: string, count: number) => {
  if (count === 1) {
    return str;
  }
  if (str.endsWith('y')) {
    return str.slice(0, -1) + 'ies';
  }
  return str + 's';
};

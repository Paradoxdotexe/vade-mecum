const VARIABLE_REGEX = /\[(.*?)\]/;

export const parseComputation = (
  computation: string,
  variables: { [key: string]: number }
): number => {
  let parsed = computation;

  let match: RegExpExecArray | null = null;
  while ((match = VARIABLE_REGEX.exec(parsed))) {
    const variable = variables[match[1]];

    const startIndex = match.index;
    const endIndex = match.index + match[0].length;

    parsed = parsed.slice(0, startIndex) + variable + parsed.slice(endIndex);
  }

  try {
    return eval(parsed);
  } catch {
    console.error(`Failed to parse computation: \n"${computation}" => \n"${parsed}"`);
    return 0;
  }
};

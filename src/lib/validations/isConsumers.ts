export function isConsumers(value: string[]): string | undefined {
  if (!value.length) return 'Insert at least one consumer';
  for (let i = 0; i < value.length; i++) {
    if (value[i].length > 100) return 'The consumer length should be less than 100';
    else if (!value[i].match(/^[a-zA-Z_]+( [a-zA-Z_]+)*$/)) return 'Invalid consumer name';
  }
}

export function isConsumer(value: string): string | undefined {
  if (value.length > 100) return 'The consumer length should be less than 100';
  else if (!value.match(/^[a-zA-Z_]+( [a-zA-Z_]+)*$/)) return 'Invalid consumer name';
}

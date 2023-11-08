export function isConsumer(value: string): string | undefined {
  if (value.length > 100) return 'The consumer length should be less than 100';
}

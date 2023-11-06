export function isConsumer(value: string[]): string | undefined {
  if (!value.length) return 'Insert at least one consumer';
  if (value.some((consumer) => consumer.length > 100)) return 'The consumer length should be less than 100';
}

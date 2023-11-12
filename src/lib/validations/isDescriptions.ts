export function isDescription(value: string): string | undefined {
  if (value.length < 3) return 'Invalid description';
  else if (value.length > 500) return 'The description is too long';
  else if (!value.match(/^[^\s]+(\s+[^\s]+)*$/)) return 'Invalid description';
}

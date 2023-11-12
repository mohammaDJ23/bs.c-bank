export function isReceiver(value: string): string | undefined {
  if (value.length < 3) return 'Invalid receiver name';
  else if (value.length > 100) return 'receiver name is too long';
  else if (!value.match(/^[a-zA-Z_]+( [a-zA-Z_]+)*$/)) return 'Invalid receiver name';
}

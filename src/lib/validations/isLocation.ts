export function isLocation(value: string): string | undefined {
  if (value.length < 3) return 'Invalid location name';
  else if (value.length > 100) return 'location name is too long';
  else if (!value.match(/^[a-zA-Z_]+( [a-zA-Z_]+)*$/)) return 'Invalid location name';
}

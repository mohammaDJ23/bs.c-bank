export function isReceiverQuery(value: string): string | undefined {
  if (value.length > 100) return 'receiver name is too long';
}

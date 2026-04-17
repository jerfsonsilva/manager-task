const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function maskUuid(id: string): string {
  if (!UUID.test(id)) {
    return '[id]';
  }

  return `uuid…${id.slice(-6)}`;
}

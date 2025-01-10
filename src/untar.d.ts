declare module 'untar' {
    export function untar(blob: Blob): Promise<Array<{ name: string; blob: Blob }>>;
  }

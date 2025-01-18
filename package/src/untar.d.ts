declare module 'untar' {
    export function untar(blob: Blob): Promise<Array<{ name: string; blob: Blob }>>;
  }
declare module 'tar-stream' {
  const createTarStream: any; // Replace `any` with specific types if you know them
  export = createTarStream;
}

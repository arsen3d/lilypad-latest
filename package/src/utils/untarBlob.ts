import tar from '../../node_modules/@types/tar-stream';

export async function untarBlob(blob: Blob): Promise<Array<{ name: string; blob: Blob }>> {
  return new Promise((resolve, reject) => {
    const extract = tar.extract();
    const files: Array<{ name: string; blob: Blob }> = [];

    extract.on('entry', (header, stream, next) => {
      const chunks: Uint8Array[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        const fileBlob = new Blob(chunks);
        files.push({ name: header.name, blob: fileBlob });
        next();
      });
      stream.resume();
    });

    extract.on('finish', () => resolve(files));
    extract.on('error', (err) => reject(err));

    
    blob.arrayBuffer().then((buffer) => {
      const uint8Array = new Uint8Array(buffer);
      extract.end(uint8Array);
    }).catch(reject);
  });
}

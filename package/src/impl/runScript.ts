import fetch from 'node-fetch';
import tar from 'tar-stream';
import base64 from 'base64-stream';
import { PassThrough } from 'stream';
// import { join } from "node:path";
// import { Client } from "@gradio/client";




export async function runModuleScript(
  _context: any,
  module: string,
  input: string
): Promise<any> {
//   if (path === "") {
//     path = join(__dirname, "..", "scripts", "python-script.py");
//   }
     
    const api = _context.getPluginConfig('api') || 'no api url. check plugin config';
    const sk = _context.getPluginConfig('sk') || 'no sk url check plugin config';
    const payload = {
      pk: sk,
      module: module,//"cowsay:v0.0.4",
    //  module:"github.com/Lilypad-Tech/lilypad-module-sdxl-pipeline:main",
      inputs: `-i "${input}"`,
      stream: "true"
    };
    const result = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${apisk}`
      },
      body: JSON.stringify(payload)
    });

    const extract = tar.extract();
    const files: { [key: string]: string } = {};

    extract.on('entry', (header, stream, next) => {
      const passThrough = new PassThrough();
      const base64Stream = new base64.Base64Encode();

      stream.pipe(passThrough).pipe(base64Stream);

      let fileContent = '';
      base64Stream.on('data', (chunk:any) => {
        fileContent += chunk;
      });

      base64Stream.on('end', () => {
        const parts = header.name.split("/");
        parts.shift();
        files[parts.join("/")] = fileContent;
        next();
      });

      stream.resume();
    });

    await new Promise((resolve, reject) => {
      extract.on('finish', resolve);
      extract.on('error', reject);
      result.body.pipe(extract);
    });

    return files;
}

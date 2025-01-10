// import { execa } from "execa";
import { join } from "node:path";
import { Client } from "@gradio/client";
export async function runPythonScript(
  _context: any,
  path: string,
  args: string[]
): Promise<string> {
  if (path === "") {
    path = join(__dirname, "..", "scripts", "python-script.py");
  }
    // try {
    //     const client = await Client.connect("http://localhost:7860/");
    //     // console.log("client", client);
    //     const result1 = await client.predict("/run", { 		
    //         dropdown: "cowsay:v0.0.4,Message", 		
    //         prompt: "Hello!!", 
    //     });
    // } catch (error) {
    //     console.error("Error running Python script:", error);
    // }
    const api = _context.getPluginConfig('api') || 'no api url. check plugin config';
    const sk = _context.getPluginConfig('sk') || 'no sk url check plugin config';
    const payload = {
      pk: sk,
      module: "cowsay:v0.0.4",
      inputs: `-i "Message=test"`,
      stream: "true"
    };
    const result = await fetch("http://localhost:4000", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${apisk}`
      },
      body: JSON.stringify(payload)
    });
    console.log(result)
    
//   const { stdout } = await execa("python3", [path, ...args]);

  return "test";
}

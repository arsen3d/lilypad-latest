import * as esbuild from "./node_modules/esbuild/lib/main";
import { match } from "./node_modules/ts-pattern/dist";
import { join, dirname } from "node:path";
import copy from "./node_modules/recursive-copy";
import { platform, homedir } from "node:os";
import { readFile, rm, mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Roughly https://github.com/demurgos/appdata-path/blob/master/lib/index.js but appdata local and .local/share, try to match `dirs` from rust
function getAppDataLocalPath() {
  const identifier = "com.ironcladapp.rivet";
  return match(platform())
    .with("win32", () => join(homedir(), "AppData", "Local", identifier))
    .with("darwin", () =>
      join(homedir(), "Library", "Application Support", identifier)
    )
    .with("linux", () => join(homedir(), ".local", "share", identifier))
    .otherwise(() => {
      if (platform().startsWith("win")) {
        return join(homedir(), "AppData", "Local", identifier);
      } else {
        return join(homedir(), ".local", "share", identifier);
      }
    });
}
mkdir(join(__dirname, ".git"), { recursive: true });
const syncPlugin: esbuild.Plugin = {
  name: "onBuild",
  setup(build) {
    // const gitDir = join(__dirname, "test");
    //   try {
    //     console.log(`Created  directory at ${gitDir}`);
    //     mkdir(gitDir, { recursive: true });
       
    //   } catch (err) {
    //     console.error(`Failed to create .git directory: ${err}`);
    //   }
    build.onEnd(async () => {
   
      // const gitDir = join(__dirname, "test");
      // try {
      //   await mkdir(gitDir, { recursive: true });
      //   console.log(`Created  directory at ${gitDir}`);
      // } catch (err) {
      //   console.error(`Failed to create .git directory: ${err}`);
      // }
      
      // const rivetExecutablePath = join(homedir(), "AppData/Local/Rivet/rivet.exe");

      // exec(`taskkill /IM rivet.exe /F`, (error, stdout, stderr) => {
      //   if (error) {
      //     console.error(`Error killing Rivet process: ${error.message}`);
      //     return;
      //   }
      //   if (stderr) {
      //     console.error(`Error output: ${stderr}`);
      //     return;
      //   }
      //   console.log(`Rivet process killed: ${stdout}`);
        
      //   exec(`start ${rivetExecutablePath}`, (startError, startStdout, startStderr) => {
      //     if (startError) {
      //   console.error(`Error starting Rivet process: ${startError.message}`);
      //   return;
      //     }
      //     if (startStderr) {
      //   console.error(`Error output: ${startStderr}`);
      //   return;
      //     }
      //     console.log(`Rivet process started: ${startStdout}`);
      //   });
      // });

      const packageJson = JSON.parse(
        await readFile(join(__dirname, "package.json"), "utf-8")
      );
     
      const pluginName = packageJson.name;

      const rivetPluginsDirectory = join(getAppDataLocalPath(), "plugins");
      const thisPluginDirectory = join(
        rivetPluginsDirectory,
        `${pluginName}-latest`
      );
      console.log("Syncing plugin to Rivet... 51"+ rivetPluginsDirectory);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      await rm(join(thisPluginDirectory, "package"), {
        recursive: true,
        force: true,
      });
      try {
        // await mkdir(rivetPluginsDirectory, { recursive: true });
        
      }catch (err) {
        // console.error(`Failed to create .git directory: ${err}`);
      }
      
     
      
      await mkdir(join(thisPluginDirectory, "package"), { recursive: true });
      // await mkdir(join(thisPluginDirectory, "package/test"), { recursive: true });
      
      await copy(
        join(__dirname, "dist"),
        join(thisPluginDirectory, "package", "dist")
      );
      await copyFile(
        join(__dirname, "package.json"),
        join(thisPluginDirectory, "package", "package.json")
      );

      // Copy .git to mark as locally installed plugin
      await copy(
        join(__dirname, ".git"),
        join(thisPluginDirectory, "package", ".git")
      );

      console.log(
        `Synced ${pluginName} to Rivet at ${thisPluginDirectory}. Refresh or restart Rivet to see changes.`
      );
    });
  },
};

// The isomorphic dynamically imports the node entry point, so we need to rewrite the import to point to the
// bundled node entry point instead of the original place it was.
const rewriteNodeEntryPlugin: esbuild.Plugin = {
  name: "rewrite-node-entry",
  setup(build) {
    build.onResolve({ filter: /\/nodeEntry$/ }, (args) => {
      return {
        external: true,
        path: "../dist/nodeEntry.cjs",
      };
    });
  },
};

const isomorphicBundleOptions: esbuild.BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "neutral",
  target: "es2020",
  outfile: "dist/bundle.js",
  format: "esm",
  external: ["./src/nodeEntry"],
  plugins: [rewriteNodeEntryPlugin],
};

const nodeBundleOptions = {
  entryPoints: ["src/nodeEntry.ts"],
  bundle: true,
  platform: "node",
  target: "es2020",
  outfile: "dist/nodeEntry.cjs",
  format: "cjs",
  plugins: [] as esbuild.Plugin[],
} satisfies esbuild.BuildOptions;

// TODO will node bundle always run after isomorphic bundle, or is there a race condition?
if (process.argv.includes("--sync")) {
  nodeBundleOptions.plugins.push(syncPlugin);
}
console.log("process.argv", process.argv);
if (process.argv.includes("--watch")) {
   const isoContext = await esbuild.context(isomorphicBundleOptions);
   isoContext.watch();

  const nodeContext = await esbuild.context(nodeBundleOptions);
  await nodeContext.watch();

  console.log("Watching for changes...");
} else {
  await esbuild.build(isomorphicBundleOptions);
  await esbuild.build(nodeBundleOptions);
}

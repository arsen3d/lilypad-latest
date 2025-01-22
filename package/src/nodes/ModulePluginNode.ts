// **** IMPORTANT ****
// Make sure you do `import type` and do not pull in the entire Rivet core library here.
// Export a function that takes in a Rivet object, and you can access rivet library functionality
// from there.
import type {
  ChartNode,
  EditorDefinition,
  Inputs,
  InternalProcessContext,
  NodeBodySpec,
  NodeConnection,
  NodeId,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeUIData,
  Outputs,
  PluginNodeImpl as ModuleNodeImpl,
  PortId,
  Project,
  Rivet,
} from "@ironclad/rivet-core";
import {
  type RivetUIContext,
} from "../../node_modules/@ironclad/rivet-core/dist/types/model/RivetUIContext";
// This defines your new type of node.
export type ModulePluginNode = ChartNode<
  "modulePlugin",
  ModulePluginNodeData
>;

// This defines the data that your new node will store.
export type ModulePluginNodeData = {
  module: string;
  input: string;
  binary_path: string
  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  useSomeDataInput?: boolean;
  useipfsInput?: boolean;
  id: string;
  cidInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function modulePluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const ModulePluginNodeImpl: ModuleNodeImpl<ModulePluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): ModulePluginNode {
      const id = rivet.newId<NodeId>()
      const node: ModulePluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: id,

        // This is the default data that your node will store
        data: {
          cidInput: true,
          module: "github.com/arsen3d/audioface_module:main",
          input: "",
          binary_path: "outputs/output.png",
          id: id,
        },

        // This is the default title of your node.
        title: "Module",

        // This must match the type of your node.
        type: "modulePlugin",

        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200,
        },
      };
      node.data.useSomeDataInput = true;
      return node;
    },

    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(
      data: ModulePluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];
      if (data.cidInput) {
        inputs.push({
          dataType: 'string',
          id: 'cid' as PortId,
          title: 'CID',
          description: 'The CID of the file to be processed.',
        });
      }else{
        const filteredNodes = Object.values(_connections).filter(node => node.inputNodeId === data.id);
        for (let i = 1; i <= filteredNodes.length + 1; i++) {
          inputs.push({
            dataType: 'any',
            id: `input${i}` as PortId,
            title: `Input ${i}`,
            description:
              'An input to create the array from. If an array, will be flattened if the "Flatten" option is enabled.',
          });
        }
      }
      

      return inputs;



    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: ModulePluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        // {
        //   id: "stdout" as PortId,
        //   dataType: "string",
        //   title: "stdout",
        // },
        // {
        //   id: "stderr" as PortId,
        //   dataType: "string",
        //   title: "stderr",
        // },
        // {
        //   id: "binary" as PortId,
        //   dataType: "any",
        //   title: "binary",
        // },
        {
          id: "ipfs_out" as PortId,
          dataType: "string",
          title: "ipfs",
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Module",
        group: "Lilypad",
        infoBoxBody: "This a Lilypad Module plugin node.",
        infoBoxTitle: "Module Plugin",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: ModulePluginNodeData,
      context: RivetUIContext
    ): EditorDefinition<ModulePluginNode>[] {
      console.log("_data", _data)
      console.log("context", context)
      // const inputs: NodeInputDefinition[] = [];

      // const _connections = context.connections;
      // const filteredNodes = Object.values(_connections).filter(node => node.inputNodeId === data.id);
      // for (let i = 1; i <= filteredNodes.length+1; i++) {
      //   inputs.push({
      //     dataType: 'any',
      //     id: `input${i}` as PortId,
      //     title: `Input ${i}`,
      //     description:
      //       'An input to create the array from. If an array, will be flattened if the "Flatten" option is enabled.',
      //   });
      // }



      return [
        {
          type: "toggle",
          dataKey: "cidInput",
          label: "CID Input",
        },
        {
          type: "string",
          dataKey: "module",
          useInputToggleDataKey: "useSomeDataInput",
          label: "module",
        },
        // {
        //   type: "string",
        //   dataKey: "input",
        //   useInputToggleDataKey: "useipfsInput",
        //   label: "input",
        // },
        {
          type: "string",
          dataKey: "binary_path",
          useInputToggleDataKey: "useSomeDataInput",
          label: "binary path",
        },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: ModulePluginNodeData,

    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      // console.log("data",data)
      return ` ${data.module}`;
       
 
    
      //   return rivet.dedent`
      //   Module: ${data.useSomeDataInput ? "(Using Input)" : data.module}
      //   Input: ${ data.input}
      // `;
      // return rivet.dedent`
      //   Module: ${data.useSomeDataInput ? "(Using Input)" : data.module}
      //   Input: ${data.useSomeDataInput ? "(Using Input)" : data.input}
      // `;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: ModulePluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {

      const api = _context.getPluginConfig('api') || 'no api url. check plugin config';
      const sk = _context.getPluginConfig('sk') || 'no sk url check plugin config';

      // var { module, cid_out, binary_path } = await GetDataInputs();
      
      const cid = inputData["cid"].value ;
      console.log("cid",cid)
      console.log("data.module",data.module)
      const payload = {
        pk: sk,
        module: data.module,
        // inputs: `-i "ENV=IPFS=${cid_out}"`,
        inputs: `-i "ENV=IPFS=${cid}"`,
        format: "ipfs",
        stream: "true"
      };
      console.log("payload", payload);

      const result = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      const json = await result.json()
      console.log("json",json);
      const parentCid = json.results[json.results.length - 1].cid;
      // var { ipfs_result, outputFileName, decodedOutput, decodedErr, binary } = await saveResults();
      window.open("http://127.0.0.1:8082/ipfs/" + parentCid )
      // let ipfs_result = "";
      return {
        // ["stdout" as PortId]: {
        //   type: "string",
        //   value: decodedOutput,
        // },
        // ["stderr" as PortId]: {
        //   type: "string",
        //   value: decodedErr,
        // },
        // ["binary" as PortId]: {
        //   type: "any",
        //   value: binary,
        // },
        ["ipfs" as PortId]: {
          type: "string",
          value: parentCid,
        },
      };

      async function saveResults() {
        const binary_path =""
        const json = await result.json();
        const decodedOutput = atob(json.stdout);
        const decodedErr = atob(json.stderr);
        let binary = null;
        if (json[binary_path] != undefined) {
          const img = atob(json[binary_path]);
          const imgBuffer = Uint8Array.from(img, c => c.charCodeAt(0));
          // console.log("imgBuffer",imgBuffer)
          binary = imgBuffer;
        }

        let ipfs_result = "";
        let outputFileName = "defaultFileName";
        if (json.files) {
          const files = json.files;
          const formData = new FormData();

          for (const filePath in files) {
            if (files.hasOwnProperty(filePath)) {
              const base64Data = files[filePath];
              const binaryData = atob(base64Data);
              const byteArray = Uint8Array.from(binaryData, char => char.charCodeAt(0));
              const blob = new Blob([byteArray]);
              formData.append('file', blob, filePath);
            }
          }

          const response = await fetch('http://localhost:5001/api/v0/add?wrap-with-directory=true', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const text = await response.text();
          const lines = text.trim().split('\n');
          const result = JSON.parse(lines[lines.length - 1]);
          ipfs_result = result.Hash;
          outputFileName = (formData.get('file') as File)?.name || 'defaultFileName';
        }
        return { ipfs_result, outputFileName, decodedOutput, decodedErr, binary };
      }

      async function GetDataInputs() {
        async function addFileToIPFS(file: Blob) {
          const formData = new FormData();
          formData.append('file', file);

          // try {
          const response = await fetch('http://localhost:5001/api/v0/add', {
            // mode: "no-cors",
            method: 'POST',
            body: formData,
          });

        }
        console.log(inputData);
        let cid_out = await (async () => {

          const inputCount = Object.keys(inputData).filter((key) => key.startsWith('input')).length;
          const formData = new FormData();

          for (let i = 1; i <= inputCount; i++) {
            const input = inputData[`input${i}` as PortId]!;
            const val = input.value;
            const t = input.type;
            // console.log("val",(Object.values(val.data).toString() as string))
            console.log("val", val);
            console.log("Type of val:", typeof val);
            if (val instanceof Object && typeof t === 'string') {
              const file = new Blob([(val as { data: string; mediaType: string; }).data], { type: (val as { data: string; mediaType: string; }).mediaType });
              const extension = (val as { mediaType: string; }).mediaType.split('/')[1];
              formData.append('file', file, `input${i}.${extension}`);
            } else {
              const file = new Blob([val as string], { type: "text/plain" });
              formData.append('file', file, `input${i}.txt`);
            }

          }
          let return_cid;

          const response = await fetch('http://localhost:5001/api/v0/add?wrap-with-directory=true', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          let txt = (await response.text()).trim().split('\n');
          console.log('IPFS Response:\n', JSON.parse(txt[txt.length - 1]));
          const result = JSON.parse(txt[txt.length - 1]); //await response.json();
          console.log(result);
          return_cid = result.Hash;
          const params = {
            arg: ['/ipfs/' + result.Hash, '']
          };

          const paramsSerializer = (params: Record<string, string | string[]>) => {
            return Object.keys(params)
              .map(key => {
                const value = params[key];
                if (Array.isArray(value)) {
                  return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
              })
              .join('&');
          };
          const cid = result.Hash;
          const fileName = result.Hash; //data.id;// 'example.txt';
          const checkUrl = new URL('http://localhost:5001/api/v0/files/stat');
          checkUrl.search = paramsSerializer({
            arg: ['/' + fileName]
          });

          const checkResponse = await fetch(checkUrl.toString(), {
            method: 'POST',
          });

          if (checkResponse.ok) {
            console.log(`File ${fileName} already exists.`);
            const rmUrl = new URL('http://localhost:5001/api/v0/files/rm');
            rmUrl.search = paramsSerializer({
              arg: ['/' + fileName],
              recursive: 'true'
            });

            const rmResponse = await fetch(rmUrl.toString(), {
              method: 'POST',
            });

            if (!rmResponse.ok) {
              throw new Error(`HTTP error! Status: ${rmResponse.status}`);
            }

            const rmResult = await rmResponse.text();
            console.log('IPFS Remove Response:', rmResult);
          }

          // if (checkResponse.ok) {
          //   console.log(`File ${fileName} already exists.`);
          // } else {
          const url = new URL('http://localhost:5001/api/v0/files/cp');
          url.search = paramsSerializer({
            arg: ['/ipfs/' + cid, '/' + fileName]
          });

          const copyResponse = await fetch(url.toString(), {
            method: 'POST',
          });

          if (!copyResponse.ok) {
            throw new Error(`HTTP error! Status: ${copyResponse.status}`);
          }

          const copyResult = await copyResponse.text();
          console.log('IPFS Copy Response:', copyResult);
          console.log('IPFS Response:', result);

          // }
          try {
          } catch (error) {
            console.error('Error:', error);
          }
          return return_cid;
        })();


        console.log("inputData", inputData, data);
        const input = rivet.getInputOrData(
          data,
          inputData,
          "input",
          "string"
        );
        const module = rivet.getInputOrData(
          data,
          inputData,
          "module",
          "string"
        );
        const binary_path = rivet.getInputOrData(
          data,
          inputData,
          "binary_path",
          "string"
        );
        return { module, cid_out, binary_path };
      }
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const modulePluginNode = rivet.pluginNodeDefinition(
    ModulePluginNodeImpl,
    "Module Plugin"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return modulePluginNode;
}

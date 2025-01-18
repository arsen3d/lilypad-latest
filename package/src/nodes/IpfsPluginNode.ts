// **** IMPORTANT ****
// Make sure you do `import type` and do not pull in the entire Rivet core library here.
// Export a function that takes in a Rivet object, and you can access rivet library functionality
// from there.
import {
  contextNode,
  nodeDefinition,
  type ChartNode,
  type EditorDefinition,
  type Inputs,
  type InternalProcessContext,
  type NodeBodySpec,
  type NodeConnection,
  type NodeId,
  type NodeInputDefinition,
  type NodeOutputDefinition,
  type NodeUIData,
  type Outputs,
  type PluginNodeImpl,
  type PortId,
  type Project,
  type Rivet,
} from "../../node_modules/@ironclad/rivet-core/dist/types";

// This defines your new type of node.
export type IpfsPluginNode = ChartNode<
  "ipfsPlugin",
  IpfsPluginNodeData
>;

// This defines the data that your new node will store.
export type IpfsPluginNodeData = {
  someData: string;
  SK: string;
  id: string;
  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  useSomeDataInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function ipfsPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const IpfsPluginNodeImpl: PluginNodeImpl<IpfsPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): IpfsPluginNode {
      const id =rivet.newId<NodeId>()
      const node: IpfsPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: id,

        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!",
          SK:"",
          id:id
        },

        // This is the default title of your node.
        title: "Ipfs",

        // This must match the type of your node.
        type: "ipfsPlugin",

        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 400,
        },
      };
      return node;
    },

    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(
      data: IpfsPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      // if (data.useSomeDataInput) {
      //   inputs.push({
      //     id: "someData" as PortId,
      //     dataType: "string",
      //     title: "Some Data",
      //   });
      //   inputs.push({
      //     id: "SK" as PortId,
      //     dataType: "string",
      //     title: "Secret Key",
      //   });
      // }
      // contextNode.getInputPortCount(connections);
      // _connections.length
      // _nodes.
      // let x=1;
      // console.log(data);
      //this.getInputPortCount(connections);
     // console.log(filteredNodes);
      // console.log(_connections)

      // const inputCount = filteredNodes.length+1;
      // for (let i = 1; i <= inputCount; i++) {
      //   console.log(_connections[i].inputNodeId);
      //   if(_connections[i].inputId ==null)
      //   {
      //     x++;
      //   }
      // }
      const filteredNodes = Object.values(_connections).filter(node => node.inputNodeId === data.id);
      for (let i = 1; i <= filteredNodes.length+1; i++) {
        inputs.push({
          dataType: 'any',
          id: `input${i}` as PortId,
          title: `Input ${i}`,
          description:
            'An input to create the array from. If an array, will be flattened if the "Flatten" option is enabled.',
        });
      }
  
      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: IpfsPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "someData" as PortId,
          dataType: "string",
          title: "Content",
        },
        {
          id: "cid" as PortId,
          dataType: "string",
          title: "CID",
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Ipfs",
        group: "Lilypad",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Example Plugin Node",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: IpfsPluginNodeData
    ): EditorDefinition<IpfsPluginNode>[] {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data",
        },
        {
          type: "string",
          dataKey: "SK",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Secret Key",
        },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: IpfsPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Example Plugin Node
        Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
      `;
    },

    
    
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    
    async process(
      data: IpfsPluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );

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
        // Object.keys(inputData).forEach((key) => {
        // console.log(inputData[key as keyof Input].value) 
        // })
        // for (let inputx<Inputs> in inputData){
        //   const formData = new FormData();
        //   const file = new Blob([inputx.valueOf("value"), { type: "text/plain" });
        //   formData.append('file', file, 'example.txt');
        // }
        // const formData = new FormData();
        // const file = new Blob(["This is a hardcoded text file content"], { type: "text/plain" });
        // formData.append('file', file, 'example.txt'); // 'example.txt' is the filename
        // const file1 = new Blob(["This is the content of the first file"], { type: "text/plain" });
        // const file2 = new Blob(["This is the content of the second file"], { type: "text/plain" });

        // formData.append('file', file1, 'file1.txt');
        // formData.append('file', file2, 'file2.txt');
        const inputCount = Object.keys(inputData).filter((key) => key.startsWith('input')).length;
        const formData = new FormData();
      
        for (let i = 1; i <= inputCount; i++) {
          const input = inputData[`input${i}` as PortId]!;
          const val= input.value;
          const t= input.type;
          // console.log("val",(Object.values(val.data).toString() as string))
            console.log("val", val);
            console.log("Type of val:", typeof val);
            if (val instanceof Object && typeof t === 'string') {
            const file = new Blob([(val as { data: string, mediaType: string }).data], { type: (val as { data: string, mediaType: string }).mediaType });
            const extension = (val as { mediaType: string }).mediaType.split('/')[1];
            formData.append('file', file, `input${i}.${extension}`);
            }else{
              const file = new Blob([val as string], { type: "text/plain" });
              formData.append('file', file, `input${i}.txt`);
            }
          // console.log(input.value)
          // outputs[`output${i}` as PortId] = input;
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
            console.log('IPFS Response:\n',JSON.parse(txt[txt.length-1]));
            const result = JSON.parse(txt[txt.length-1])//await response.json();
            console.log(result)
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
            const fileName = "inputs";//data.id;// 'example.txt';
            const checkUrl = new URL('http://localhost:5001/api/v0/files/stat');
            checkUrl.search = paramsSerializer({
              arg: ['/' + fileName]
            });

            const checkResponse = await fetch(checkUrl.toString(), {
              method: 'POST',
            });

            // if (checkResponse.ok) {
            //   const removeUrl = new URL('http://localhost:5001/api/v0/files/rm');
            //   removeUrl.search = paramsSerializer({
            //     arg: ['/' + fileName]
            //   });

            //   const removeResponse = await fetch(removeUrl.toString(), {
            //     method: 'POST',
            //   });

            //   if (!removeResponse.ok) {
            //     throw new Error(`HTTP error! Status: ${removeResponse.status}`);
            //   }

            //   console.log(`File ${fileName} removed.`);
            // }

            if (checkResponse.ok) {
              console.log(`File ${fileName} already exists.`);
            } else {
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

              // const copyResult = await copyResponse.text();
              // console.log('IPFS Copy Response:', copyResult);
              // console.log('IPFS Response:', result);
            }
            try {
          
        } catch (error) {
            console.error('Error:', error);
        }
        return return_cid
    })();
    //  const result = await fetch("https://jsonplaceholder.typicode.com/posts" )
    // const response = await fetch("http://localhost:5001/api/v0/add", {
    //   method: "POST",
    //   mode: "no-cors",
    //   body: JSON.stringify({
    //     path: "test.txt",
    //     content: "test",
    //     mode: 0o644,
    //     mtime: { secs: Math.floor(Date.now() / 1000), nsecs: 0 },
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // const result = await response.json();
    // console.log(result);

      return {
        ["cid" as PortId]: {
          type: "string",
          value: "IPFS="+cid_out,
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const ipfsPluginNode = rivet.pluginNodeDefinition(
    IpfsPluginNodeImpl,
    "Ipfs Plugin"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return ipfsPluginNode;
}

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
  PluginNodeImpl,
  PortId,
  Project,
  Rivet,
} from "../../node_modules/@ironclad/rivet-core/dist/types";
// import { untar } from "untar" ;
// import { untarBlob } from '../utils/untarBlob';
// import { Client } from "@gradio/client";

// This defines your new type of node.
export type CowsayPluginNode = ChartNode<
  "cowsayPlugin",
  CowsayPluginNodeData
>;

// This defines the data that your new node will store.
export type CowsayPluginNodeData = {
  someData: string;
  SK: string;
  prompt: string;
  stdout: string;
  stderr: string;
  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  useSomeDataInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function cowsayPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const CowsayPluginNodeImpl: PluginNodeImpl<CowsayPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): CowsayPluginNode {
      const node: CowsayPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP",
          SK:"",
          prompt: "",
          stdout: "",
          stderr: "",
        },

        // This is the default title of your node.
        title: "Cowsay",

        // This must match the type of your node.
        type: "cowsayPlugin",

        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200,
        },
      };
      return node;
    },

    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(
      data: CowsayPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];
      console.log("data",data)
      if (data.useSomeDataInput) {
      }
        inputs.push({
          id: "prompt" as PortId,
          dataType: "string",
          title: "Prompt",
        });
        // inputs.push({
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // });
   

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: CowsayPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "STDOUTData" as PortId,
          dataType: "string",
          title: "STDOUT",
        },
        {
          id: "STDERRData" as PortId,
          dataType: "string",
          title: "STDERR",
        },
        // {
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Cowsay",
        group: "Lilypad",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Example Plugin Node",
      };
    },



    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: CowsayPluginNodeData
    ): EditorDefinition<CowsayPluginNode>[] {
      return [
        // {
        //   type: "string",
        //   dataKey: "someData",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "Some Data",
        // },
        {
          type: "string",
          dataKey: "prompt",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Prompt",
        },
        // {
        //   type: "string",
        //   dataKey: "SK",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "Secret Key",
        // },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: CowsayPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Prompt:
        ${!data.prompt ? "(Using Input)" : data.prompt}
      `;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: CowsayPluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      console.log("inputData",inputData,data)
      const prompt = rivet.getInputOrData(
        data,
        inputData,
        "prompt",
        "string"
      );
      console.log("prompt1",prompt)
    //  const result = await fetch("https://jsonplaceholder.typicode.com/posts" )

    // const r = await fetch("http://localhost:4000/ping");
    // console.log(r)
    // // console.log(await r.text());
    const api = _context.getPluginConfig('api') || 'no api url. check plugin config';
    const sk = _context.getPluginConfig('sk') || 'no sk url check plugin config';
    // const payload = {
    //   pk: sk,
    //   module: someData.split(",")[0],
    //   inputs: `-i "${someData.split(",")[1]}="`,
    //   stream: "true"
    // };
    // const result = await fetch("http://localhost:4000", {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${apisk}`
    //   },
    //   body: JSON.stringify(payload)
    // });
   

    // import { Client } from "@gradio/client";

  // const client = await Client.connect("http://localhost:7860/");
  // const result1 = await client.predict("/run", { 		
  //     dropdown: "cowsay:v0.0.4,Message", 		
  //     prompt: "Hello!!", 
  // });

  // console.log(result1.data);
    
    const s = "await result " 
    // const tar = await result.blob();
    // const files = await untarBlob(tar);
    // console.log("files", files);

    // try {
    //   const files = await untarBlob(tar);
    //   console.log("files", files);
    //   for (const file of files) {
    //     console.log(`Extracted file: ${file.name}`);
    //   }
    // } catch (error) {
    //   console.error("Error extracting tar file:", error);
    // }

    // console.log("Received tar file:", tar);

    const { runModuleScript: runModule } = await import("../nodeEntry");
    const output = await runModule(_context,"cowsay:v0.0.4", "Message="+prompt);
    const decodedOutput = Buffer.from(output.stdout, 'base64').toString('utf-8');
    const decodedErr = Buffer.from(output.stderr, 'base64').toString('utf-8');
    // const decodedOutput = prompt  
    return {
        // ["someData" as PortId]: {
        //   type: "string",
        //   value: decodedOutput,
        // },
        ["STDOUTData" as PortId]: {
          type: "string",
          value: decodedOutput,
        },
        ["STDERRData" as PortId]: {
          type: "string",
          value: decodedErr,
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const cowsayPluginNode = rivet.pluginNodeDefinition(
    CowsayPluginNodeImpl,
    "Example Plugin"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return cowsayPluginNode;
}

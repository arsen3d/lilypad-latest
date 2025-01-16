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
  MarkdownNodeBodySpec,
  NodeConnection,
  NodeId,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeUIData,
  Outputs,
  PluginNodeImpl as RealtimeAgentNodeImpl,
  PortId,
  Project,
  Rivet,
} from "../../node_modules/@ironclad/rivet-core/dist/types";

// This defines your new type of node.
export type RealtimeAgentPluginNode = ChartNode<
  "realtimeagentPlugin",
  RealtimeAgentPluginNodeData
>;

// This defines the data that your new node will store.
export type RealtimeAgentPluginNodeData = {
  module: string;
  input: string;
  binary_path:string
  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  useSomeDataInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function realtimeagentPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const RealtimeAgentPluginNodeImpl: RealtimeAgentNodeImpl<RealtimeAgentPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): RealtimeAgentPluginNode {
      const node: RealtimeAgentPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          module: "github.com/noryev/module-sdxl-ipfs:ae17e969cadab1c53d7cabab1927bb403f02fd2a",
          input:"prompt=cow",
          binary_path:"outputs/output.png"
        },

        // This is the default title of your node.
        title: "Realtime Agent",

        // This must match the type of your node.
        type: "realtimeagentPlugin",

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
      data: RealtimeAgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useSomeDataInput) {
        // inputs.push({
        //   id: "module" as PortId,
        //   dataType: "string",
        //   title: "module",
        // });
        // inputs.push({
        //   id: "input" as PortId,
        //   dataType: "string",
        //   title: "input",
        // });
        // inputs.push({
        //   id: "json" as PortId,
        //   dataType: "string",
        //   title: "input",
        // });
      }

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: RealtimeAgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "stdout" as PortId,
          dataType: "string",
          title: "URL",
        },
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
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Realtime Agent",
        group: "Lilypad",
        infoBoxBody: "This a Lilypad Realtime Agent plugin node.",
        infoBoxTitle: "Realtime Agent Plugin",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: RealtimeAgentPluginNodeData
    ): EditorDefinition<RealtimeAgentPluginNode>[] {
      return [
        // {
        //   type: "string",
        //   dataKey: "module",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "module",
        // },
        // {
        //   type: "string",
        //   dataKey: "input",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "input",
        // },
        // {
        //   type: "string",
        //   dataKey: "binary_path",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "binary path",
        // },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: RealtimeAgentPluginNodeData
    ): string | MarkdownNodeBodySpec | MarkdownNodeBodySpec[] | undefined {
      // const b:MarkdownNodeBodySpec = {type:"markdown",text:`![Alt text](https://file-examples.com/wp-content/storage/2017/04/file_example_MP4_480_1_5MG.mp4)`}  ;
      const b:MarkdownNodeBodySpec = {type:"markdown",text:`<iframe onload="console.log(parent.postMessage('test'))" frameborder="0"  height="100%"  width="100%" src=https://file-examples.com/wp-content/storage/2017/04/file_example_MP4_480_1_5MG.mp4 />[![Watch the video](https://file-examples.com/wp-content/storage/2017/04/file_example_MP4_480_1_5MG.mp4)](https://file-examples.com/wp-content/storage/2017/04/file_example_MP4_480_1_5MG.mp4)`}  ;
      
      // MarkdownNodeBodySpec.fromMarkdown(``)
      // const body = .fromMarkdown(`
     
      //   ## test
      //   Module: ${data.useSomeDataInput ? "(Using Input)" : data.module}
      //   Input: ${data.useSomeDataInput ? "(Using Input)" : data.input}
      // `);
      return b
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
async process(
      data: RealtimeAgentPluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      console.log("inputData",inputData,data)
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
    const api = _context.getPluginConfig('api') || 'no api url. check plugin config';
    const sk = _context.getPluginConfig('sk') || 'no sk url check plugin config';
    const payload = {
      pk: sk,
      module: module,
      inputs: `-i "${input}"`,
      format: "json",
      stream: "true"
    };
    const result = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const json = await result.json()
    const decodedOutput = atob(json.stdout)
    const decodedErr = atob(json.stderr);
    let binary = null
    if(json[binary_path] != undefined){
      const img = atob(json[binary_path]);
      const imgBuffer = Uint8Array.from(img, c => c.charCodeAt(0));
      // console.log("imgBuffer",imgBuffer)
      binary = imgBuffer
    }
    return {
        ["stdout" as PortId]: {
          type: "string",
          value: decodedOutput,
        },
        ["stderr" as PortId]: {
          type: "string",
          value: decodedErr,
        },
        ["binary" as PortId]: {
          type: "any",
          value: binary,
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const realtimeagentPluginNode = rivet.pluginNodeDefinition(
    RealtimeAgentPluginNodeImpl,
    "RealtimeAgent Plugin"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return realtimeagentPluginNode;
}

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
  PluginNodeImpl as AgentNodeImpl,
  PortId,
  Project,
  Rivet,
} from "../../node_modules/@ironclad/rivet-core/dist/types";


// This defines your new type of node.
export type AgentPluginNode = ChartNode<
  "agentPlugin",
  AgentPluginNodeData
>;

// This defines the data that your new node will store.
export type AgentPluginNodeData = {
  module: string;
  input: string;
  binary_path:string
  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  useSomeDataInput?: boolean;
  useipfsInput?: boolean ;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function agentPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const AgentPluginNodeImpl: AgentNodeImpl<AgentPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): AgentPluginNode {
      const node: AgentPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          module: "github.com/noryev/module-sdxl-ipfs:ae17e969cadab1c53d7cabab1927bb403f02fd2a",
          input:"prompt=cows",
          binary_path:"outputs/output.png"
        },

        // This is the default title of your node.
        title: "Agent",

        // This must match the type of your node.
        type: "agentPlugin",

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
      data: AgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useSomeDataInput) {
        inputs.push({
          id: "module" as PortId,
          dataType: "string",
          title: "module",
        });
        inputs.push({
          id: "input" as PortId,
          dataType: "string",
          title: "input",
        });
        inputs.push({
          id: "json" as PortId,
          dataType: "string",
          title: "json",
        });
      }
      if (data.useipfsInput) {
        inputs.push({
          id: "module" as PortId,
          dataType: "string",
          title: "module",
        });
        inputs.push({
          id: "input" as PortId,
          dataType: "string",
          title: "input",
        });
        inputs.push({
          id: "json" as PortId,
          dataType: "string",
          title: "json",
        });
      }


      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: AgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "stdout" as PortId,
          dataType: "string",
          title: "stdout",
        },
        {
          id: "stderr" as PortId,
          dataType: "string",
          title: "stderr",
        },
        {
          id: "binary" as PortId,
          dataType: "any",
          title: "binary",
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Agent",
        group: "Lilypad",
        infoBoxBody: "This a Lilypad Agent plugin node.",
        infoBoxTitle: "Agent Plugin",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: AgentPluginNodeData
    ): EditorDefinition<AgentPluginNode>[] {
      return [
        {
          type: "string",
          dataKey: "module",
          useInputToggleDataKey: "useSomeDataInput",
          label: "module",
        },
        {
          type: "string",
          dataKey: "input",
          useInputToggleDataKey: "useipfsInput",
          label: "input",
        },
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
      data: AgentPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Module: ${data.useSomeDataInput ? "(Using Input)" : data.module}
        Input: ${data.useSomeDataInput ? "(Using Input)" : data.input}
      `;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
async process(
      data: AgentPluginNodeData,
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
  const agentPluginNode = rivet.pluginNodeDefinition(
    AgentPluginNodeImpl,
    "Agent Plugin"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return agentPluginNode;
}

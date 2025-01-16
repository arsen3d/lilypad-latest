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

 
// This defines your new type of node.
export type SearchAgentPluginNode = ChartNode<
  "searchAgentPlugin",
  SearchAgentPluginNodeData
>;

// This defines the data that your new node will store.
export type SearchAgentPluginNodeData = {
  someData: string;
  // SK: string;
  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  useSomeDataInput?: boolean;
};

export function searchAgentPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const SearchAgentPluginNodeImpl: PluginNodeImpl<SearchAgentPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): SearchAgentPluginNode {
      const node: SearchAgentPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!",
          // SK:""
        },

        // This is the default title of your node.
        title: "Paper Search Agent",

        // This must match the type of your node.
        type: "searchAgentPlugin",

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
      data: SearchAgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData" as PortId,
          dataType: "string",
          title: "Terms",
        });
        // inputs.push({
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // });
      }

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: SearchAgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "someData" as PortId,
          dataType: "string",
          title: "Results",
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
        contextMenuTitle: "Paper Search Agent",
        group: "BioMl",
        infoBoxBody: "Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.",
        infoBoxTitle: "The Search Agent",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: SearchAgentPluginNodeData
    ): EditorDefinition<SearchAgentPluginNode>[] {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data",
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
      data: SearchAgentPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Agent-1: The Search Agent is the entry point into the Decentralized AI-Oncologist pipeline. Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.
        
      `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: SearchAgentPluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );

     const result = await fetch("https://jsonplaceholder.typicode.com/posts" )
     
      return {
        ["someData" as PortId]: {
          type: "string",
          value: await result.text(),
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const searchAgentPluginNode = rivet.pluginNodeDefinition(
    SearchAgentPluginNodeImpl,
    "Search Agent"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return searchAgentPluginNode;
}

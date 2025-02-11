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
export type PaperReaderAgentPluginNode = ChartNode<
  "paperReaderAgentPlugin",
  PaperReaderAgentPluginNodeData
>;

// This defines the data that your new node will store.
export type PaperReaderAgentPluginNodeData = {
  prompt: string;
  model: "DeepSeek 70B" | "Falcon3 7B" | "DeepSeek 671B"; // Dropdown options
  inputData: string;
  useSomeDataInput?: boolean;
 
};

// // This defines your new type of node.
// export type PaperReaderAgentPluginNode = ChartNode<
//   "paperReaderAgentPlugin",
//   PaperReaderAgentPluginNodeData
// >;

// // This defines the data that your new node will store.
// export type PaperReaderAgentPluginNodeData = {
//   someData: string;
//   // SK: string;
//   // It is a good idea to include useXInput fields for any inputs you have, so that
//   // the user can toggle whether or not to use an import port for them.
//   useSomeDataInput?: boolean;
// };

export function paperReaderAgentPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const PaperReaderPluginNodeImpl: PluginNodeImpl<PaperReaderAgentPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): PaperReaderAgentPluginNode {
      const node: PaperReaderAgentPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        
        // This is the default data that your node will store
        data: {
          prompt: "You are an expert oncology researcher who is performing a close reading of immuno therapy papers to find paragraphs containing potentially useful molecules. Please read the paragraph you are provided and decide on a scale of 1-100 how likely it is that that paragraph contains the description of or information related to an immuno-therapy related molecule.",
          model: "DeepSeek 70B",
          inputData: "Selected Papers",
          useSomeDataInput: true,
        },

        // This is the default title of your node.
        title: "Paper Reader Agent",

        // This must match the type of your node.
        type: "paperReaderAgentPlugin",

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
      data: PaperReaderAgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useSomeDataInput) {
        inputs.push({
          id: "Papers" as PortId,
          dataType: "string",
          title: "Papers",
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
      _data: PaperReaderAgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "outputData" as PortId,
          dataType: "string",
          title: "Selected Paragraphs",
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
        contextMenuTitle: "Paper Reader Agent",
        group: "BioMl",
        infoBoxBody: "Its core function is to process the documents retrieved by Agent-1 (The Search Agent) at a finer granularity—examining each paper paragraph-by-paragraph. The goal is to identify textual segments that potentially describe proteins, molecules, or structural features relevant to the target disease context discovered in the literature.",
        infoBoxTitle: "The Paper Reader ",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: PaperReaderAgentPluginNodeData
    ): EditorDefinition<PaperReaderAgentPluginNode>[] {
      return [
        {
          type: "string",
          dataKey: "prompt",
          // useInputToggleDataKey: "useSomeDataInput",
          label: "Prompt",
        },
        {
          type: "dropdown",
          dataKey: "model",
          // useInputToggleDataKey: "useSomeDataInput",
          label: "Model",
          options: [
            { value: "DeepSeek 70B", label: "DeepSeek 70B" },
            { value: "Falcon3 7B", label: "Falcon3 7B" },
            { value: "DeepSeek 671B", label: "DeepSeek 671B" },
          ],
        },
        {
          type: "string",
          dataKey: "inputData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Input:",
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
      data: PaperReaderAgentPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Model: ${data.model}\n
        Input: ${data.useSomeDataInput?"<<Data>>":data.inputData}\n
        Output: <<Selected Paragraphs>>\n
        Prompt: ${data.prompt}\n
      `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: PaperReaderAgentPluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "inputData",
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
  const paperReaderAgentPluginNode = rivet.pluginNodeDefinition(
    PaperReaderPluginNodeImpl,
    "Paper Reader Agent"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return paperReaderAgentPluginNode;
}

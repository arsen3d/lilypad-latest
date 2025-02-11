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
export type ProteinDesignerAgentPluginNode = ChartNode<
  "proteinDesignerAgentPlugin",
  ProteinDesignerAgentPluginNodeData
>;

// This defines the data that your new node will store.
export type ProteinDesignerAgentPluginNodeData = {
  prompt: string;
  model: "DeepSeek 70B" | "Falcon3 7B" | "DeepSeek 671B" | "Pinal"; // Dropdown options
  inputData: string;
  useSomeDataInput?: boolean;
};

export function proteinDesignerAgentPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const ProteinDesignerAgentPluginNodeImpl: PluginNodeImpl<ProteinDesignerAgentPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): ProteinDesignerAgentPluginNode {
      const node: ProteinDesignerAgentPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          prompt: "You are an expert oncology researcher who is helping select scientific papers to be used as a basis for new immuno-therapy design and discovery. You will be given the title of a paper and the abstract, and you need to decided on a scale of 1-100 how likely that paper is to be relevent to the topic-target.",
          model: "Pinal",
          inputData: "Paper titles + abstracts + topic-target",
          useSomeDataInput: true,
        },
        // This is the default title of your node.
        title: "Protein Designer Agent",

        // This must match the type of your node.
        type: "proteinDesignerAgentPlugin",

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
      data: ProteinDesignerAgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData" as PortId,
          dataType: "string",
          title: "PDB-generation-prompt + Report",
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
      _data: ProteinDesignerAgentPluginNodeData,
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
        contextMenuTitle: "Protein Designer Agent",
        group: "BioMl",
        infoBoxBody: "Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.",
        infoBoxTitle: "The Protein Designer Agent",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: ProteinDesignerAgentPluginNodeData
    ): EditorDefinition<ProteinDesignerAgentPluginNode>[] {
      return [
        {
          type: "string",
          dataKey: "prompt",
          label: "Prompt",
        },
        {
          type: "dropdown",
          dataKey: "model",
          label: "Model",
          options: [
            { value: "Pinal", label: "Pinal" },
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
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: ProteinDesignerAgentPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
      Model: ${data.model}\n
      Input: ${data.useSomeDataInput?"<<Selected paragraphs>>":data.inputData}\n
      Output: <<Protein generation prompt + Report>>\n
      Prompt: ${data.prompt}\n
    `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: ProteinDesignerAgentPluginNodeData,
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
  const proteinDesignerAgentPluginNode = rivet.pluginNodeDefinition(
    ProteinDesignerAgentPluginNodeImpl,
    "Search Agent"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return proteinDesignerAgentPluginNode;
}
